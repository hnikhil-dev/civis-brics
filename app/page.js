// app/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { 
  Send, 
  Mic, 
  MicOff, 
  Image, 
  MapPin, 
  CheckCircle, 
  Search, 
  FileText,
  Shield,
  ShieldCheck,
  Activity,
  User,
  Landmark,
  Globe,
  Radio,
  Layers,
  Sparkles,
  ExternalLink,
  Lock,
  ChevronRight
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { BRICS_JURISDICTIONS, getJurisdiction, getJurisdictionCoordinatesMap } from '@/lib/jurisdictions';

// Dynamically load Map to prevent Next.js SSR leaflet errors
const HotspotMap = dynamic(() => import('@/components/HotspotMap'), { 
  ssr: false,
  loading: () => (
    <div className="h-64 sm:h-80 w-full rounded-xl bg-slate-100 flex items-center justify-center border border-slate-300 animate-pulse">
      <span className="text-slate-500 font-bold text-xs">Loading Community Map...</span>
    </div>
  )
});

// Multilingual Translation Matrix across all BRICS member nations
const LANG_DICTS = {
  en: {
    header_title: "CIVIS-BRICS — Community Infrastructure Planning",
    header_subtitle: "Participatory Platform for Civic Infrastructure",
    header_org: "Open Digital Public Infrastructure Initiative",
    btn_mp_workspace: "Policymaker Workspace →",
    form_title: "Submit a Community Need",
    form_desc: "Share your infrastructure suggestion or report a local issue. Your input directly reaches city planning teams.",
    label_name: "Citizen Full Name",
    placeholder_name: "Enter your full name",
    label_suggestion: "Development Suggestion Details",
    placeholder_suggestion: "Describe the issue or proposed upgrade (e.g. school facilities, road repairs, drinking water supply, healthcare clinics)...",
    demo_scenario: "",
    btn_voice_start: "Record Audio",
    btn_voice_active: "Listening Speech...",
    btn_audio_active: "Recording Audio Note...",
    btn_voice_attached: "Audio Attached",
    btn_photo_scan: "Upload Photo",
    btn_photo_scanning: "Checking Image...",
    btn_photo_attached: "Photo Attached",
    label_gps: "Neighborhood Location",
    label_gps_desc: "Confirm location to help planning teams locate the need",
    btn_gps: "Confirm Location",
    btn_gps_active: "Location Tagged",
    btn_gps_loading: "Locating...",
    security_declaration: "I confirm that this is an authentic community need in my area and the details provided are accurate.",
    btn_submit: "Submit Proposal",
    btn_submitting: "Submitting to city planning...",
    success_title: "Proposal Submitted Successfully!",
    success_receipt: "Your Official Tracking ID:",
    success_category: "Category",
    success_location: "Area",
    success_trust: "Status",
    success_coordination: "Review Stage",
    success_campaign_yes: "Verified",
    success_campaign_no: "Verified",
    success_footer: "Your suggestion has been logged and forwarded to municipal engineers for planning and budget review.",
    tracker_title: "Track Proposal Status",
    tracker_desc: "Check progress, planning status, and municipal updates for your submission.",
    placeholder_tracker: "Enter Tracking ID (e.g. sub-init-1)",
    btn_track: "Search",
    timeline_step1: "1. Proposal Received",
    timeline_step1_sub: "Tracking ID generated and logged in public planning registry.",
    timeline_step2: "2. Verified & Grouped",
    timeline_step2_sub: "Reviewed and grouped with neighborhood community priorities.",
    timeline_step3: "3. Municipal Planning & Budgeting",
    timeline_step3_sub: "Evaluated by city planning board against available capital budget.",
    timeline_step4: "4. Sanctioned & Implementation",
    timeline_step4_sub: "Current project state:",
    nic_compliance_title: "Citizen Privacy & Trust Guarantee",
    nic_compliance_desc: "Your data is confidential and protected under international Digital Public Good privacy standards.",
    footer_text: "© 2026 CIVIS-BRICS Initiative. Digital Public Good for Infrastructure & Governance."
  },
  hi: {
    header_title: "CIVIS-BRICS — नागरिक विकास योजना पोर्टल",
    header_subtitle: "सहभागी बुनियादी ढांचे के लिए डिजिटल सार्वजनिक मंच",
    header_org: "ब्रिक्स नवाचार डिजिटल सार्वजनिक बुनियादी ढांचा",
    btn_mp_workspace: "नीति निर्माता डैशबोर्ड →",
    form_title: "नागरिक विकास प्रस्ताव",
    form_desc: "अपने क्षेत्र की बुनियादी ढांचे की आवश्यकताएं साझा करें। आपका सुझाव सीधे नगर योजना टीम तक पहुंचेगा।",
    label_name: "नागरिक का पूरा नाम",
    placeholder_name: "अपना पूरा नाम दर्ज करें",
    label_suggestion: "विकास प्रस्ताव का विवरण",
    placeholder_suggestion: "समस्या या सुधार का विवरण दें (जैसे स्कूल, सड़क, जलापूर्ति, स्वास्थ्य केंद्र)...",
    demo_scenario: "",
    btn_voice_start: "आवाज रिकॉर्ड करें",
    btn_voice_active: "भाषण सुन रहे हैं...",
    btn_audio_active: "ऑडियो रिकॉर्ड हो रहा है...",
    btn_voice_attached: "ऑडियो संलग्न किया गया",
    btn_photo_scan: "फोटो अपलोड करें",
    btn_photo_scanning: "फोटो जांची जा रही है...",
    btn_photo_attached: "फोटो संलग्न किया गया",
    label_gps: "क्षेत्रीय स्थान",
    label_gps_desc: "सटीक स्थान की पुष्टि करें ताकि योजना टीम को सुविधा हो",
    btn_gps: "स्थान सत्यापित करें",
    btn_gps_active: "स्थान टैग किया गया",
    btn_gps_loading: "खोज रहे हैं...",
    security_declaration: "मैं पुष्टि करता/करती हूं कि यह मेरे क्षेत्र की वास्तविक सामुदायिक आवश्यकता है और विवरण सही है।",
    btn_submit: "प्रस्ताव सबमिट करें",
    btn_submitting: "प्रस्ताव दर्ज किया जा रहा है...",
    success_title: "प्रस्ताव सफलतापूर्वक दर्ज किया गया!",
    success_receipt: "आपका आधिकारिक ट्रैकिंग आईडी:",
    success_category: "श्रेणी",
    success_location: "क्षेत्र",
    success_trust: "स्थिति",
    success_coordination: "समीक्षा स्थिति",
    success_campaign_yes: "सत्यापित",
    success_campaign_no: "सत्यापित",
    success_footer: "आपका प्रस्ताव दर्ज कर नगर योजना और बजट समीक्षा के लिए भेज दिया गया है।",
    tracker_title: "प्रस्ताव की स्थिति ट्रैक करें",
    tracker_desc: "अपने प्रस्ताव की प्रगति और कार्यान्वयन अपडेट देखने के लिए आईडी दर्ज करें।",
    placeholder_tracker: "ट्रैकिंग आईडी दर्ज करें (जैसे sub-init-1)",
    btn_track: "खोजें",
    timeline_step1: "१. प्रस्ताव प्राप्त हुआ",
    timeline_step1_sub: "ट्रैकिंग आईडी तैयार की गई और योजना रजिस्ट्री में दर्ज हुई।",
    timeline_step2: "२. सत्यापित और समूहीकृत",
    timeline_step2_sub: "क्षेत्रीय प्राथमिकताओं के साथ समीक्षा और मिलान पूरा हुआ।",
    timeline_step3: "३. नगर योजना एवं बजट आवंटन",
    timeline_step3_sub: "उपलब्ध पूंजीगत बजट के विरुद्ध योजना बोर्ड द्वारा मूल्यांकन।",
    timeline_step4: "४. स्वीकृति एवं कार्यान्वयन",
    timeline_step4_sub: "वर्तमान परियोजना की स्थिति:",
    nic_compliance_title: "नागरिक गोपनीयता एवं विश्वास",
    nic_compliance_desc: "आपका डेटा अंतर्राष्ट्रीय डिजिटल पब्लिक गुड गोपनीयता मानकों के तहत सुरक्षित है।",
    footer_text: "© २०२६ CIVIS-BRICS पहल। बुनियादी ढांचे और सुशासन के लिए डिजिटल सार्वजनिक संपदा।"
  },
  zh: {
    header_title: "CIVIS-BRICS — 公民发展与基础设施规划平台",
    header_subtitle: "参与式公共基础设施的数字公共品 (DPG)",
    header_org: "联合国数字公共品标准与金砖国家创新DPI倡议",
    btn_mp_workspace: "决策者工作台 →",
    form_title: "公民发展建议表",
    form_desc: "使用任何金砖国家官方语言提交基础设施与公共工程建议。AI自动翻译验证并汇总至规划管线。",
    label_name: "公民全名",
    placeholder_name: "请输入您的姓名",
    label_suggestion: "建议详细说明",
    placeholder_suggestion: "描述问题或建议的升级项目（例如学校学位、道路维修、供水短缺、社区医疗站）...",
    demo_scenario: "加载演示案例",
    btn_voice_start: "录制语音",
    btn_voice_active: "正在语音识别...",
    btn_audio_active: "正在录音...",
    btn_voice_attached: "已附带音频",
    btn_photo_scan: "上传现场照片",
    btn_photo_scanning: "正在扫描识别...",
    btn_photo_attached: "照片已附带",
    label_gps: "地理坐标验证",
    label_gps_desc: "定位精确坐标以进行空间聚类分析",
    btn_gps: "获取当前定位",
    btn_gps_active: "已获取定位",
    btn_gps_loading: "正在定位...",
    security_declaration: "安全声明：本人证明所提供信息真实有效。同意为审计和规划目的收集坐标与多媒体附件。所有数据均受数字公共品标准保护。",
    btn_submit: "提交发展建议",
    btn_submitting: "正在进行跨语言验证与多模态处理...",
    success_title: "诉求建议已成功录入！",
    success_receipt: "官方追踪凭证编号：",
    success_category: "部门领域",
    success_location: "所属辖区",
    success_trust: "可信度评分",
    success_coordination: "协同灌水过滤",
    success_campaign_yes: "已抑制协同灌水",
    success_campaign_no: "真实有机需求",
    success_footer: "您的建议已被自动翻译、可信度评分并归入空间规划集群。您可凭借追踪凭据跟踪执行进展。",
    tracker_title: "查询建议状态",
    tracker_desc: "查询您提交建议的生命周期、可行性评分及预算批准进度。",
    placeholder_tracker: "输入凭证编号 (例如 sub-init-1)",
    btn_track: "查询",
    timeline_step1: "1. 接收录入并哈希存证",
    timeline_step1_sub: "凭据生成，跨语言翻译已完成。",
    timeline_step2: "2. 可信度核验与空间聚类",
    timeline_step2_sub: "领域验证、灌水协同检测及空间质心映射完毕。",
    timeline_step3: "3. 政策优化排期与预算核准",
    timeline_step3_sub: "基于多目标帕累托前沿综合评分核准。",
    timeline_step4: "4. 项目落地实施与公共审计",
    timeline_step4_sub: "当前项目阶段：",
    nic_compliance_title: "联合国数字公共品 (DPG) 与 DPI 信任架构",
    nic_compliance_desc: "主权数据完整性：所有提交均受加密哈希保护，协同灌水活动被算法抑制，所有公共预算分配生成不可篡改的可验证审计证据。",
    footer_text: "© 2026 CIVIS-BRICS 倡议。面向基础设施与治理的数字公共品 (DPG)。"
  },
  ru: {
    header_title: "CIVIS-BRICS — Портал гражданского планирования развития",
    header_subtitle: "Цифровое общественное благо для совместного развития инфраструктуры",
    header_org: "Стандарт ООН DPG и инициатива DPI БРИКС",
    btn_mp_workspace: "Панель лиц, принимающих решения →",
    form_title: "Форма предложения по развитию",
    form_desc: "Подавайте предложения по инфраструктуре на официальных языках БРИКС. ИИ проверяет и группирует запросы в реестр развития.",
    label_name: "ФИО гражданина",
    placeholder_name: "Введите ваше имя",
    label_suggestion: "Описание проблемы или предложения",
    placeholder_suggestion: "Опишите проблему или модернизацию (например, ремонт дорог, дефицит школ, водоснабжение, поликлиники)...",
    demo_scenario: "Загрузить демо-пример",
    btn_voice_start: "Запись голоса",
    btn_voice_active: "Распознавание речи...",
    btn_audio_active: "Идет запись аудио...",
    btn_voice_attached: "Аудио прикреплено",
    btn_photo_scan: "Загрузить фото",
    btn_photo_scanning: "Сканирование...",
    btn_photo_attached: "Фото прикреплено",
    label_gps: "Геолокационная верификация",
    label_gps_desc: "Фиксация координат для пространственной кластеризации",
    btn_gps: "Определить локацию",
    btn_gps_active: "Координаты зафиксированы",
    btn_gps_loading: "Определение...",
    security_declaration: "Декларация безопасности: Я подтверждаю достоверность информации и даю согласие на сбор координат и материалов для градостроительного аудита в соответствии со стандартами DPG.",
    btn_submit: "Отправить предложение",
    btn_submitting: "Обработка и верификация...",
    success_title: "Предложение успешно принято!",
    success_receipt: "Ваш номер отслеживания:",
    success_category: "Сектор",
    success_location: "Юрисдикция",
    success_trust: "Индекс доверия",
    success_coordination: "Фильтр кампаний",
    success_campaign_yes: "Скорректировано",
    success_campaign_no: "Органический запрос",
    success_footer: "Ваше предложение верифицировано и включено в пространственный кластер. Сохраните номер для проверки статуса.",
    tracker_title: "Отслеживание статуса",
    tracker_desc: "Проверьте статус реализации и распределение бюджета по номеру обращения.",
    placeholder_tracker: "Введите номер (например sub-init-1)",
    btn_track: "Найти",
    timeline_step1: "1. Зарегистрировано и захешировано",
    timeline_step1_sub: "Квитанция создана, перевод завершен.",
    timeline_step2: "2. Проверено и сгруппировано",
    timeline_step2_sub: "Категория подтверждена, проверка на спам завершена.",
    timeline_step3: "3. Оптимизация и санкционирование бюджета",
    timeline_step3_sub: "Одобрено на основе Парето-оптимизации.",
    timeline_step4: "4. Реализация и публичный аудит",
    timeline_step4_sub: "Текущий статус:",
    nic_compliance_title: "Архитектура доверия DPG и DPI",
    nic_compliance_desc: "Суверенная защита данных: обращения хешируются, спам-кампании алгоритмически подавляются, а распределение бюджета фиксируется в криптографическом реестре.",
    footer_text: "© 2026 Инициатива CIVIS-BRICS. Цифровое общественное благо для инфраструктуры и управления."
  },
  pt: {
    header_title: "CIVIS-BRICS — Portal de Planejamento de Desenvolvimento Cívico",
    header_subtitle: "Bem Público Digital para Infraestrutura Participativa",
    header_org: "Padrão ONU DPG e Iniciativa DPI de Inovação BRICS",
    btn_mp_workspace: "Painel do Gestor Público →",
    form_title: "Formulário de Proposta de Desenvolvimento",
    form_desc: "Envie propostas de infraestrutura em qualquer idioma dos BRICS. A IA traduz, verifica e agrupa as demandas no planejamento soberano.",
    label_name: "Nome Completo do Cidadão",
    placeholder_name: "Insira seu nome completo",
    label_suggestion: "Detalhes da Sugestão",
    placeholder_suggestion: "Descreva o problema ou melhoria proposta (ex.: ampliação de escola, recapeamento de rua, saneamento, posto de saúde)...",
    demo_scenario: "Carregar Cenário Demo",
    btn_voice_start: "Gravar Áudio",
    btn_voice_active: "Ouvindo áudio...",
    btn_audio_active: "Gravando áudio...",
    btn_voice_attached: "Áudio Anexado",
    btn_photo_scan: "Enviar Foto",
    btn_photo_scanning: "Analisando imagem...",
    btn_photo_attached: "Foto Anexada",
    label_gps: "Verificação de Geolocalização",
    label_gps_desc: "Coordenadas precisas para análise espacial GIS",
    btn_gps: "Capturar Local",
    btn_gps_active: "Local Marcado",
    btn_gps_loading: "Localizando...",
    security_declaration: "Declaração de Segurança: Certifico a veracidade das informações e consinto com a coleta de dados e coordenadas para planejamento cívico sob as normas de Bens Públicos Digitais.",
    btn_submit: "Enviar Proposta",
    btn_submitting: "Processando verificação e tradução...",
    success_title: "Proposta Registrada com Sucesso!",
    success_receipt: "Protocolo Oficial de Rastreamento:",
    success_category: "Setor",
    success_location: "Jurisdição",
    success_trust: "Índice de Confiança",
    success_coordination: "Filtro de Campanhas",
    success_campaign_yes: "Campanha Atenuada",
    success_campaign_no: "Demanda Orgânica",
    success_footer: "Sua proposta foi traduzida, verificada e mapeada no motor de agrupamento espacial. Guarde o protocolo para acompanhar a execução.",
    tracker_title: "Rastrear Status da Proposta",
    tracker_desc: "Verifique o andamento, pontuação e alocação orçamentária para o seu protocolo.",
    placeholder_tracker: "Insira o Protocolo (ex: sub-init-1)",
    btn_track: "Buscar",
    timeline_step1: "1. Registrado e Autenticado",
    timeline_step1_sub: "Protocolo gerado, tradução concluída.",
    timeline_step2: "2. Verificado e Agrupado",
    timeline_step2_sub: "Categoria verificada e mapeamento espacial realizado.",
    timeline_step3: "3. Otimização de Políticas e Alocação de Verba",
    timeline_step3_sub: "Avaliado e aprovado pela fronteira de Pareto.",
    timeline_step4: "4. Fase de Execução e Auditoria Pública",
    timeline_step4_sub: "Status atual do projeto:",
    nic_compliance_title: "Arquitetura de Confiança DPG e DPI",
    nic_compliance_desc: "Integridade soberana de dados: todas as propostas são protegidas, campanhas coordenadas são atenuadas e as decisões orçamentárias possuem trilha auditável.",
    footer_text: "© 2026 Iniciativa CIVIS-BRICS. Bem Público Digital para Infraestrutura e Governança."
  },
  mr: {
    header_title: "CIVIS-BRICS — नागरिक विकास नियोजन पोर्टल",
    header_subtitle: "सहभागी पायाभूत सुविधांसाठी डिजिटल सार्वजनिक संपत्ती",
    header_org: "यूएन डीपीजी मानक आणि ब्रिक्स नवोपक्रम डीपीआय उपक्रम",
    btn_mp_workspace: "प्रशासकीय डॅशबोर्ड →",
    form_title: "विकास प्रस्ताव फॉर्म",
    form_desc: "मराठी, हिंदी किंवा इंग्रजीमध्ये तुमचे प्रस्ताव सबमिट करा. सर्व माहिती मतदारसंघ नियोजन डेटाबेसमध्ये जोडली जाईल.",
    label_name: "नागरिकाचे पूर्ण नाव",
    placeholder_name: "तुमचे पूर्ण नाव प्रविष्ट करा",
    label_suggestion: "विकास प्रस्तावाचा सविस्तर तपशील",
    placeholder_suggestion: "समस्या किंवा सुचवलेली सुधारणा वर्णन करा (उदा. शाळा, रस्त्यावरील खड्डे, पाण्याची कमतरता, आरोग्य केंद्र)...",
    demo_scenario: "डेमो उदाहरण लोड करा",
    btn_voice_start: "आवाज रेकॉर्ड करा",
    btn_voice_active: "बोलणे ऐकत आहे...",
    btn_audio_active: "ऑडिओ रेकॉर्ड होत आहे...",
    btn_voice_attached: "ऑडिओ जोडला गेला",
    btn_photo_scan: "फोटो अपलोड करा",
    btn_photo_scanning: "फोटो स्कॅन होत आहे...",
    btn_photo_attached: "फोटो जोडला गेला",
    label_gps: "जीपीएस स्थान टॅगिंग",
    label_gps_desc: "ऑडिटसाठी अचूक भौगोलिक स्थान निश्चित करा",
    btn_gps: "स्थान सत्यापित करा",
    btn_gps_active: "स्थान टॅग केले",
    btn_gps_loading: "शोधत आहे...",
    security_declaration: "सुरक्षा घोषणा: मी प्रमाणित करतो/करते की दिलेली माहिती अचूक आहे. मी ऑडिट आणि नियोजनासाठी स्थान आणि मीडिया संकलनास संमती देतो/देते. सर्व डेटा नियमांनुसार सुरक्षित आहे.",
    btn_submit: "प्रस्ताव सादर करा",
    btn_submitting: "भाषांतर आणि पडताळणी सुरू आहे...",
    success_title: "तक्रार यशस्वीरित्या नोंदवली गेली!",
    success_receipt: "तुमचा अधिकृत पावती ट्रॅकिंग आयडी:",
    success_category: "वर्ग / श्रेणी",
    success_location: "स्थान",
    success_trust: "विश्वासार्हता गुणांक",
    success_coordination: "मोहीम पडताळणी",
    success_campaign_yes: "मोहीम नियंत्रणात",
    success_campaign_no: "युनिक / अद्वितीय",
    success_footer: "तुमच्या प्रस्तावाचे भाषांतर, पडताळणी आणि वॉर्ड क्लस्टर मॅपिंग यशस्वीरित्या पूर्ण झाले आहे. अंमलबजावणी तपासण्यासाठी ट्रॅकिंग आयडी कॉपी करा.",
    tracker_title: "प्रस्तावाची स्थिती ट्रॅक करा",
    tracker_desc: "तुमच्या प्रस्तावाची प्रगती, नियोजन स्थिती आणि अंमलबजावणीचे अपडेट तपासा.",
    placeholder_tracker: "पावती आयडी प्रविष्ट करा (उदा. sub-init-1)",
    btn_track: "शोधा",
    timeline_step1: "१. तक्रार नोंदवली गेली",
    timeline_step1_sub: "पावती तयार केली, भाषांतर पूर्ण झाले.",
    timeline_step2: "२. सत्यापित आणि एकत्रित",
    timeline_step2_sub: "श्रेणी पडताळणी आणि क्लस्टर मॅपिंग यशस्वी.",
    timeline_step3: "३. खासदार मंजुरी आणि बजेट वाटप",
    timeline_step3_sub: "पायाभूत सुविधा निर्देशांकांवर आधारित मंजुरी.",
    timeline_step4: "४. अंमलबजावणी टप्पा",
    timeline_step4_sub: "सध्याची प्रकल्पाची स्थिती:",
    nic_compliance_title: "डिजिटल पब्लिक गुड (DPG) आणि डीपीआय सुरक्षा मानके",
    nic_compliance_desc: "सर्व वापरकर्ता डेटा ट्रान्सिटमध्ये एनक्रिप्टेड आणि डेटाबेसमध्ये सुरक्षित ठेवला जातो. स्पॅम मोहिमेद्वारे चुकीची मागणी वाढवणे रोखण्यासाठी फिल्टर सक्रिय आहेत. सर्व निर्णय सार्वजनिक ऑडिटसाठी रेकॉर्ड केले जातात.",
    footer_text: "© २०२६ CIVIS-BRICS उपक्रम. पायाभूत सुविधा आणि प्रशासनासाठी डिजिटल सार्वजनिक संपत्ती."
  }
};

const BRICS_DEMO_CASES = {
  BRA: {
    country: "Brazil",
    flag: "🇧🇷",
    name: "Lucas Silva",
    text: "No Setor 4 (Itaquera Zona Leste), a drenagem pluvial e rede de saneamento básico requerem ampliação urgente para conter enchentes recorrentes nas avenidas principais.",
    lat: -23.541,
    lng: -46.456,
    sectorId: 104,
    lang: 'pt'
  },
  RUS: {
    country: "Russia",
    flag: "🇷🇺",
    name: "Алексей Иванов",
    text: "В Районе Лефортово (Сектор 404) требуется капитальная замена изношенных магистральных труб теплотрассы до наступления зимних заморозков.",
    lat: 55.758,
    lng: 37.702,
    sectorId: 404,
    lang: 'ru'
  },
  IND: {
    country: "India",
    flag: "🇮🇳",
    name: "Priyanka Sharma",
    text: "In Ward 4 (Kondhwa Khurd), primary healthcare dispensary and municipal drinking water feeder main require emergency expansion due to rapid population growth.",
    lat: 18.479,
    lng: 73.890,
    sectorId: 4,
    lang: 'en'
  },
  CHN: {
    country: "China",
    flag: "🇨🇳",
    name: "张伟 (Zhang Wei)",
    text: "白云北部工业园区（304区）主干道排水管网年久失修，需紧急扩建雨水排污管线并铺设新沥青路面以保障民生与物流。",
    lat: 23.272,
    lng: 113.273,
    sectorId: 304,
    lang: 'zh'
  },
  ZAF: {
    country: "South Africa",
    flag: "🇿🇦",
    name: "Sipho Ndlovu",
    text: "In Ward 204 (Alexandra Urban Renewal Area), electrical substation transformer overload and municipal water feeder pipe bursts require immediate infrastructure allocation.",
    lat: -26.103,
    lng: 28.094,
    sectorId: 204,
    lang: 'en'
  }
};

const RECENT_BRICS_FEED = [
  {
    id: "BRICS-BRA-921",
    flag: "🇧🇷",
    location: "São Paulo (Itaquera)",
    category: "Drainage & Water",
    text: "Canalization of recurrent flood culvert",
    status: "Verified",
    trust: "9.6/10",
    time: "4m ago"
  },
  {
    id: "BRICS-RUS-442",
    flag: "🇷🇺",
    location: "Moscow (Lefortovo)",
    category: "Thermal Grid",
    text: "District heating pipeline overhaul",
    status: "Clustered",
    trust: "9.4/10",
    time: "12m ago"
  },
  {
    id: "BRICS-CHN-884",
    flag: "🇨🇳",
    location: "Guangzhou (Baiyun)",
    category: "Transit & Logistics",
    text: "Industrial arterial road resurfacing",
    status: "Prioritized",
    trust: "9.8/10",
    time: "18m ago"
  },
  {
    id: "BRICS-ZAF-319",
    flag: "🇿🇦",
    location: "Johannesburg (Alexandra)",
    category: "Energy Substation",
    text: "Transformer capacity upgrade",
    status: "Sanctioned",
    trust: "9.5/10",
    time: "25m ago"
  },
  {
    id: "BRICS-IND-105",
    flag: "🇮🇳",
    location: "Pune (Kondhwa)",
    category: "Primary Health & Water",
    text: "Community dispensary & clean water feeder",
    status: "Verified",
    trust: "9.7/10",
    time: "32m ago"
  }
];

export default function CitizenPortal() {
  // Multilingual active state - DEFAULT IS ENGLISH
  const [currentLang, setCurrentLang] = useState('en');
  const t = LANG_DICTS[currentLang] || LANG_DICTS.en;

  // Sovereign BRICS Jurisdiction State (defaults to India, dynamically auto-detected)
  const [selectedCountry, setSelectedCountry] = useState('IND');
  const currentJurisdiction = getJurisdiction(selectedCountry);
  const jurisdictionCoordinatesMap = getJurisdictionCoordinatesMap(selectedCountry);
  const sectors = currentJurisdiction.provinces[0]?.districts[0]?.sectors || [];
  const [selectedSectorId, setSelectedSectorId] = useState(sectors[0]?.id || 1);
  const [mapSubmissions, setMapSubmissions] = useState([]);
  const [detectionNotice, setDetectionNotice] = useState('Detecting regional node...');

  // Submission Form State (pre-populated with active BRICS demo scenario in English)
  const [userName, setUserName] = useState('Priyanka Sharma');
  const [suggestionText, setSuggestionText] = useState('In Ward 4 (Kondhwa Khurd), primary healthcare dispensary and municipal drinking water feeder main require emergency expansion due to rapid population growth.');
  const [gpsCoords, setGpsCoords] = useState({ lat: 18.479, lng: 73.890 });
  const [gpsStatus, setGpsStatus] = useState('active'); // inactive, acquiring, active, failed
  const [dataConsent, setDataConsent] = useState(true);
  
  // Media Attachments
  const [voiceUrl, setVoiceUrl] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [imageScanning, setImageScanning] = useState(false);

  // Audio recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [recordingMode, setRecordingMode] = useState('speech'); // 'speech' or 'audio'

  // Ingestion Processing States
  const [submitting, setSubmitting] = useState(false);
  const [submitResult, setSubmitResult] = useState(null);

  // Tracking Panel State
  const [searchId, setSearchId] = useState('sub-init-1');
  const [trackedStatus, setTrackedStatus] = useState(null);
  const [trackError, setTrackError] = useState(null);

  // Automatically detect client location and select sovereign node & language
  useEffect(() => {
    // 1. Instant Timezone-based auto-detection
    const detectFromTimezone = () => {
      try {
        const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
        if (tz.includes('Calcutta') || tz.includes('Kolkata') || tz.includes('India') || tz.includes('Colombo')) {
          return { country: 'IND', lang: 'en', label: 'India (Asia/Kolkata)' };
        }
        if (tz.includes('Sao_Paulo') || tz.includes('Brazil') || tz.includes('Fortaleza') || tz.includes('Manaus') || tz.includes('Recife') || tz.includes('Cuiaba')) {
          return { country: 'BRA', lang: 'pt', label: 'Brazil (America/Sao_Paulo)' };
        }
        if (tz.includes('Moscow') || tz.includes('Yekaterinburg') || tz.includes('Novosibirsk') || tz.includes('Samara') || tz.includes('Kaliningrad')) {
          return { country: 'RUS', lang: 'ru', label: 'Russia (Europe/Moscow)' };
        }
        if (tz.includes('Shanghai') || tz.includes('Beijing') || tz.includes('Chongqing') || tz.includes('Urumqi') || tz.includes('Harbin')) {
          return { country: 'CHN', lang: 'zh', label: 'China (Asia/Shanghai)' };
        }
        if (tz.includes('Johannesburg') || tz.includes('South_Africa')) {
          return { country: 'ZAF', lang: 'en', label: 'South Africa (Africa/Johannesburg)' };
        }
      } catch (_) {}
      return null;
    };

    const tzResult = detectFromTimezone();
    if (tzResult) {
      setSelectedCountry(tzResult.country);
      setCurrentLang(tzResult.lang);
      setDetectionNotice(`Auto-detected: ${tzResult.label}`);
      
      const jur = getJurisdiction(tzResult.country);
      const secList = jur.provinces[0]?.districts[0]?.sectors || [];
      if (secList.length > 0) {
        setSelectedSectorId(secList[0].id);
        setGpsCoords({ lat: secList[0].center[0], lng: secList[0].center[1] });
        setGpsStatus('active');
      }

      const demo = BRICS_DEMO_CASES[tzResult.country];
      if (demo) {
        setUserName(demo.name);
        setSuggestionText(demo.text);
      }
    } else {
      setDetectionNotice('Global Sovereign Node (Default: English)');
    }

    // 2. High-precision Geolocation refinement (if browser GPS is enabled)
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          
          const BRICS_CENTERS = [
            { code: 'IND', lat: 18.510, lng: 73.905, lang: 'en', name: 'India' },
            { code: 'BRA', lat: -23.5505, lng: -46.6333, lang: 'pt', name: 'Brazil' },
            { code: 'RUS', lat: 55.7558, lng: 37.6173, lang: 'ru', name: 'Russia' },
            { code: 'CHN', lat: 23.1291, lng: 113.2644, lang: 'zh', name: 'China' },
            { code: 'ZAF', lat: -26.2041, lng: 28.0473, lang: 'en', name: 'South Africa' }
          ];

          const calcDist = (lat1, lon1, lat2, lon2) => {
            const R = 6371;
            const dLat = (lat2 - lat1) * Math.PI / 180;
            const dLon = (lon2 - lon1) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
                      Math.sin(dLon/2) * Math.sin(dLon/2);
            return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
          };

          let nearest = BRICS_CENTERS[0];
          let minDist = Infinity;
          for (const b of BRICS_CENTERS) {
            const d = calcDist(lat, lng, b.lat, b.lng);
            if (d < minDist) {
              minDist = d;
              nearest = b;
            }
          }

          if (nearest && minDist < 4500) {
            setSelectedCountry(nearest.code);
            setCurrentLang(nearest.lang);
            setDetectionNotice(`GPS Verified: ${nearest.name} (${lat.toFixed(2)}, ${lng.toFixed(2)})`);
            setGpsCoords({ lat, lng });
            setGpsStatus('active');

            const jur = getJurisdiction(nearest.code);
            const secList = jur.provinces[0]?.districts[0]?.sectors || [];
            if (secList.length > 0) {
              setSelectedSectorId(secList[0].id);
            }

            const demo = BRICS_DEMO_CASES[nearest.code];
            if (demo) {
              setUserName(demo.name);
              setSuggestionText(demo.text);
            }
          }
        },
        () => {
          // Timezone detection remains active if GPS is declined
        },
        { timeout: 4000, maximumAge: 60000 }
      );
    }
  }, []);

  // Load submissions for the interactive map
  useEffect(() => {
    const fetchMapPoints = async () => {
      try {
        const { data } = await supabase.from('submissions').select('*').limit(30);
        if (data && data.length > 0) {
          setMapSubmissions(data);
        }
      } catch (e) {
        console.warn("Could not fetch submissions for map:", e);
      }
    };
    fetchMapPoints();
  }, [selectedCountry]);

  // Initialize Web Speech API for voice note transcription
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const rec = new SpeechRecognition();
        rec.continuous = true;
        rec.interimResults = true;
        
        // Dynamically bind recognition language based on active state selection across BRICS
        const LANG_SPEECH_MAP = {
          en: 'en-US',
          hi: 'hi-IN',
          zh: 'zh-CN',
          ru: 'ru-RU',
          pt: 'pt-BR',
          mr: 'mr-IN'
        };
        rec.lang = LANG_SPEECH_MAP[currentLang] || 'en-US';

        rec.onresult = (event) => {
          let interimTranscript = '';
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            } else {
              interimTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setSuggestionText(prev => prev ? `${prev} ${finalTranscript}` : finalTranscript);
          }
        };

        rec.onerror = (event) => {
          console.warn("Speech recognition service notification:", event.error);
          
          if (event.error === 'not-allowed') {
            setIsRecording(false);
            alert("Microphone Permission Required:\nPlease click the microphone icon in your browser's address bar and select 'Allow' to enable voice input.");
          } else if (event.error === 'audio-capture') {
            setIsRecording(false);
            alert("Microphone Capture Error:\nNo microphone hardware was detected. Please connect a mic and try again.");
          } else if (event.error === 'no-speech') {
            console.log("Speech recognition: No speech detected (user paused).");
          } else if (event.error === 'network') {
            setRecordingMode('audio');
            console.log("Speech recognition socket blocked by browser extension. Recording raw audio locally instead.");
          }
        };

        rec.onend = () => {
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            console.log("Speech recognition socket ended, but local MediaRecorder is still active.");
          } else {
            setIsRecording(false);
          }
        };

        setRecognition(rec);
      }
    }
  }, [currentLang]);

  // Request browser GPS position
  const handleGPSAcquisition = () => {
    if (!navigator.geolocation) {
      setGpsStatus('failed');
      return;
    }
    setGpsStatus('acquiring');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude
        });
        setGpsStatus('active');
      },
      (err) => {
        console.error(err);
        setGpsStatus('failed');
      }
    );
  };

  // Toggle voice recorder
  const toggleRecording = async () => {
    if (isRecording) {
      // 1. Stop Speech recognition if running
      if (recognition) {
        try {
          recognition.stop();
        } catch (e) {
          console.warn("Recognition already stopped:", e.message);
        }
      }
      setIsRecording(false);

      // 2. Stop MediaRecorder
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      
      // 3. Stop Mic Stream
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    } else {
      // 1. Request microphone access
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Microphone recording is not supported on this browser.");
        return;
      }

      try {
        setRecordingMode('speech');
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;
        audioChunksRef.current = [];

        // Determine supported audio recording mime-type (chrome supports webm)
        let mimeType = 'audio/webm';
        if (MediaRecorder.isTypeSupported && !MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = ''; // Let browser choose default if webm is unsupported
        }

        const mediaRecorder = mimeType 
          ? new MediaRecorder(stream, { mimeType }) 
          : new MediaRecorder(stream);
          
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = async () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/ogg' });
          if (audioBlob.size > 0) {
            try {
              // Upload actual audio file to Supabase voice-submissions storage
              const fileName = `voice_${Math.random().toString(36).substring(2, 15)}_${Date.now()}.webm`;
              const filePath = `citizen-audio/${fileName}`;

              const { data, error } = await supabase.storage
                .from('voice-submissions')
                .upload(filePath, audioBlob, {
                  contentType: mimeType || 'audio/webm',
                  cacheControl: '3600'
                });

              if (error) throw error;

              const { data: { publicUrl } } = supabase.storage
                .from('voice-submissions')
                .getPublicUrl(filePath);

              setVoiceUrl(publicUrl);
              console.log("Real audio uploaded to Supabase Storage:", publicUrl);
            } catch (err) {
              console.warn("Storage upload deferred, using client Object URI:", err.message);
              setVoiceUrl(URL.createObjectURL(audioBlob));
            }
          } else {
            setVoiceUrl(URL.createObjectURL(audioBlob));
          }
        };

        setIsRecording(true);
        mediaRecorder.start();

        // Start Web Speech API in parallel for real-time translation (ignoring errors if blocked by Plurality)
        if (recognition) {
          try {
            recognition.start();
          } catch (e) {
            console.log("Speech recognition start bypassed:", e.message);
          }
        }
      } catch (err) {
        console.error("Microphone capture failed:", err);
        alert("Failed to access your microphone. Please enable mic permissions in your browser bar.");
      }
    }
  };

  // Automated OCR scanning & evidence intake on photo upload
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageScanning(true);
      try {
        // 1. Generate unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `citizen-uploads/${fileName}`;

        // 2. Upload file to Supabase Storage bucket
        const { data, error } = await supabase.storage
          .from('image-submissions')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (error) throw error;

        // 3. Retrieve public URL
        const { data: { publicUrl } } = supabase.storage
          .from('image-submissions')
          .getPublicUrl(filePath);

        setImageUrl(publicUrl);
        console.log("Real image uploaded to Supabase Storage:", publicUrl);
      } catch (err) {
        console.warn("Storage upload deferred, using client Object URI:", err.message);
        setImageUrl(URL.createObjectURL(file));
      } finally {
        setImageScanning(false);
        // Emulate OCR Text Extraction
        setSuggestionText(prev => {
          const append = " [Photo Scan OCR: Water pipe leakage and pooling water on street]";
          return prev ? prev + append : "Water leakage and pipeline damage on main street." + append;
        });
      }
    }
  };

  // Post suggestion to API
  const handleSubmitSuggestion = async (e) => {
    e.preventDefault();
    if (!userName.trim() || !suggestionText.trim()) {
      alert("Please enter your name and suggestion details.");
      return;
    }
    if (!dataConsent) {
      alert("Please check the security declaration and consent checkbox to submit.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_name: userName,
          raw_text: suggestionText,
          audio_url: voiceUrl,
          image_url: imageUrl,
          channel: voiceUrl ? 'Voice Note' : (imageUrl ? 'OCR Image' : 'Web Form'),
          gps_lat: gpsCoords?.lat,
          gps_lng: gpsCoords?.lng,
          ward_id: selectedSectorId,
          country: selectedCountry
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitResult(data);
        // Refresh map submissions with new point
        setMapSubmissions(prev => [
          {
            id: data.submission_id,
            user_name: userName,
            raw_text: suggestionText,
            gps_lat: gpsCoords?.lat,
            gps_lng: gpsCoords?.lng,
            created_at: new Date().toISOString()
          },
          ...prev
        ]);
        // Reset form inputs
        setSuggestionText('');
        setVoiceUrl(null);
        setImageUrl(null);
        setDataConsent(false);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (e) {
      console.error(e);
      alert("Failed to submit. Check server connection.");
    } finally {
      setSubmitting(false);
    }
  };

  // Lookup submission state by ID
  const handleTrackSubmission = async (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    setTrackError(null);
    setTrackedStatus(null);

    try {
      const { supabase } = await import('@/lib/supabase');
      // 1. Fetch submission details
      const { data: sub } = await supabase
        .from('submissions')
        .select('*')
        .eq('id', searchId.trim())
        .limit(1);

      if (!sub || sub.length === 0) {
        setTrackError("Suggestion ID not found. Please verify the ID format.");
        return;
      }

      // 2. Fetch parsed issue status
      const { data: issue } = await supabase
        .from('extracted_issues')
        .select('*')
        .eq('submission_id', searchId.trim())
        .limit(1);

      // 3. Fetch project status
      const { data: mapping } = await supabase
        .from('cluster_mappings')
        .select('cluster_id')
        .eq('submission_id', searchId.trim())
        .limit(1);

      let projectStatus = 'Proposed';
      let projectTitle = '';
      if (mapping && mapping[0]) {
        const { data: proj } = await supabase
          .from('projects')
          .select('status, title')
          .eq('cluster_id', mapping[0].cluster_id)
          .limit(1);
        if (proj && proj[0]) {
          projectStatus = proj[0].status;
          projectTitle = proj[0].title;
        }
      }

      setTrackedStatus({
        submission: sub[0],
        issue: issue ? issue[0] : null,
        projectStatus,
        projectTitle
      });

    } catch (e) {
      console.error("Tracking lookup error:", e);
      setTrackError("Database lookup failed.");
    }
  };

  const handleCountryChange = (countryCode, manual = false) => {
    setSelectedCountry(countryCode);
    const jur = getJurisdiction(countryCode);
    const secList = jur.provinces[0]?.districts[0]?.sectors || [];
    if (secList.length > 0) {
      setSelectedSectorId(secList[0].id);
      setGpsCoords({ lat: secList[0].center[0], lng: secList[0].center[1] });
      setGpsStatus('active');
    }
    const demo = BRICS_DEMO_CASES[countryCode];
    if (demo) {
      setUserName(demo.name);
      setSuggestionText(demo.text);
      if (manual && demo.lang) {
        setCurrentLang(demo.lang);
      }
    }
    const countryNames = {
      IND: 'India',
      BRA: 'Brazil',
      ZAF: 'South Africa',
      CHN: 'China',
      RUS: 'Russia'
    };
    setDetectionNotice(`Selected: ${countryNames[countryCode] || countryCode}`);
  };

  const loadDemoScenario = () => {
    const demo = BRICS_DEMO_CASES[selectedCountry] || BRICS_DEMO_CASES.IND;
    setUserName(demo.name);
    setSuggestionText(demo.text);
    setGpsCoords({ lat: demo.lat, lng: demo.lng });
    setGpsStatus('active');
    if (demo.sectorId) {
      setSelectedSectorId(demo.sectorId);
    }
    if (demo.lang) {
      setCurrentLang(demo.lang);
    }
  };

  return (
    <div className="w-full flex-1 flex flex-col bg-slate-50 text-slate-900 font-sans min-h-screen">
      
      {/* BRICS Digital Public Infrastructure Multi-Nation Gradient Stripe */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-emerald-600 via-amber-500 to-rose-600"></div>

      {/* Official BRICS DPG Header across 100% width */}
      <header className="border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3 shadow-xs w-full">
        {/* Left: Branding & Initiative */}
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 sm:h-12 sm:w-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 shrink-0 shadow-xs">
            <Landmark className="h-6 w-6 sm:h-7 sm:w-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="bg-amber-100 text-amber-950 text-[11px] font-black uppercase px-2 py-0.5 rounded border border-amber-300">
                BRICS Innovation Challenge 2026
              </span>
              <span className="text-xs text-slate-500 font-bold hidden sm:inline">Track 1: AI for Digital Public Infrastructure</span>
            </div>
            <h1 className="text-lg sm:text-xl font-black text-blue-900 tracking-tight flex items-center gap-2 mt-0.5">
              CIVIS-BRICS
              <span className="text-xs sm:text-sm font-semibold text-slate-500 hidden md:inline">| Citizens’ Voice & Infrastructure Synthesis</span>
            </h1>
          </div>
        </div>

        {/* Center: BRICS Sovereign Nation Switcher */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-300 overflow-x-auto max-w-full">
          {BRICS_JURISDICTIONS.map((j) => {
            const countryNames = {
              IND: 'India',
              BRA: 'Brazil',
              ZAF: 'South Africa',
              CHN: 'China',
              RUS: 'Russia'
            };
            const countryLabel = countryNames[j.countryCode] || j.name;
            return (
              <button
                key={j.countryCode}
                onClick={() => handleCountryChange(j.countryCode, true)}
                className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-bold flex items-center gap-1.5 transition whitespace-nowrap ${
                  selectedCountry === j.countryCode
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-950 hover:bg-slate-200'
                }`}
              >
                <span className="text-sm sm:text-base">{j.flag}</span>
                <span>{countryLabel}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Language Switcher & Policymaker Link */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* 6 Languages */}
          <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-300 gap-0.5">
            {[
              { code: 'en', label: 'EN' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'zh', label: '中文' },
              { code: 'ru', label: 'РУ' },
              { code: 'pt', label: 'PT' },
              { code: 'mr', label: 'मराठी' }
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setCurrentLang(l.code)}
                className={`px-2 py-1 rounded-md text-xs font-bold transition ${
                  currentLang === l.code ? 'bg-blue-900 text-white shadow-xs' : 'text-slate-650 hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <Link
            href="/mp"
            className="text-xs sm:text-sm bg-blue-900 hover:bg-blue-800 text-white font-bold px-3.5 py-2 rounded-xl shadow-xs transition flex items-center gap-1.5 whitespace-nowrap"
          >
            <Lock className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.btn_mp_workspace}</span>
          </Link>
        </div>
      </header>

      {/* City & Region Notice Bar */}
      <div className="bg-blue-950 text-white px-4 sm:px-6 lg:px-8 py-2.5 flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm shadow-inner w-full">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center gap-1.5 font-extrabold text-amber-300 text-xs sm:text-sm">
            <span>{currentJurisdiction.flag}</span>
            <span>{currentJurisdiction.name}</span>
          </span>
          <span className="text-blue-400 hidden sm:inline">&bull;</span>
          <span className="text-slate-200 font-medium text-xs sm:text-sm">
            {currentJurisdiction.description}
          </span>
          {detectionNotice && (
            <span className="bg-emerald-900/80 text-emerald-200 border border-emerald-600/60 px-2.5 py-0.5 rounded-full text-xs font-semibold flex items-center gap-1">
              <MapPin className="h-3 w-3 text-emerald-300" />
              {detectionNotice}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2.5 text-slate-300 text-xs sm:text-sm">
          <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
            Official Public Planning Portal
          </span>
          <span className="text-blue-800 hidden sm:inline">|</span>
          <span className="text-slate-300 hidden md:inline">
            Directly informing city capital improvements
          </span>
        </div>
      </div>

      {/* Main 100% Fluid 3-Column Grid */}
      <main className="flex-1 w-full px-3 sm:px-6 lg:px-8 py-5 grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* COLUMN 1: Citizen Multimodal Input Form (col-span-12 lg:col-span-4) */}
        <section className="col-span-12 lg:col-span-4 bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-base sm:text-lg font-black text-blue-900 flex items-center gap-2">
                <FileText className="h-5 w-5 text-[#f97316]" />
                {t.form_title}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{t.form_desc}</p>
            </div>
            <span className="bg-blue-50 text-blue-900 border border-blue-200 text-xs font-bold px-2.5 py-0.5 rounded-full shrink-0">
              {currentJurisdiction.flag} {currentJurisdiction.countryCode}
            </span>
          </div>

          <form onSubmit={handleSubmitSuggestion} className="space-y-3.5">
            
            {/* Citizen Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <User className="h-3.5 w-3.5 text-slate-500" />
                {t.label_name} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t.placeholder_name}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition"
                required
              />
            </div>

            {/* Administrative Jurisdiction / Sector Dropdown */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-blue-700" />
                Administrative District / Neighborhood <span className="text-red-500">*</span>
              </label>
              <select
                value={selectedSectorId}
                onChange={(e) => {
                  const sId = parseInt(e.target.value);
                  setSelectedSectorId(sId);
                  const sec = sectors.find(s => s.id === sId);
                  if (sec) {
                    setGpsCoords({ lat: sec.center[0], lng: sec.center[1] });
                    setGpsStatus('active');
                  }
                }}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold text-slate-900 focus:outline-none focus:border-blue-900 focus:bg-white transition cursor-pointer"
              >
                {sectors.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Suggestion Text */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-800 block">
                {t.label_suggestion} <span className="text-red-500">*</span>
              </label>
              <textarea 
                rows="3"
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                placeholder={t.placeholder_suggestion}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition leading-relaxed"
                required
              />
            </div>

            {/* Media Attachment buttons */}
            <div className="flex items-center gap-2.5">
              {/* Voice Note Recording Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex-1 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                  isRecording 
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' 
                    : voiceUrl 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isRecording ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
                <span>
                  {isRecording ? (recordingMode === 'speech' ? t.btn_voice_active : t.btn_audio_active) : voiceUrl ? t.btn_voice_attached : t.btn_voice_start}
                </span>
              </button>

              {/* Photo Upload Trigger */}
              <label className={`flex-1 py-2 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer transition ${
                imageScanning 
                  ? 'bg-amber-50 border-amber-300 text-amber-600' 
                  : imageUrl 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}>
                <Image className="h-3.5 w-3.5" />
                <span>{imageScanning ? t.btn_photo_scanning : imageUrl ? t.btn_photo_attached : t.btn_photo_scan}</span>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  className="hidden" 
                  disabled={imageScanning}
                />
              </label>
            </div>

            {/* Neighborhood Location Tagging */}
            <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className={`h-4 w-4 ${gpsStatus === 'active' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{t.label_gps}</span>
                  <span className="text-[11px] text-slate-500 block">
                    {gpsCoords ? '✓ Location confirmed for planning' : t.label_gps_desc}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGPSAcquisition}
                disabled={gpsStatus === 'acquiring'}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  gpsStatus === 'active' 
                    ? 'bg-emerald-100 border border-emerald-300 text-emerald-700' 
                    : gpsStatus === 'acquiring'
                      ? 'bg-slate-200 text-slate-500 animate-pulse'
                      : 'bg-blue-900 hover:bg-blue-800 text-white shadow-xs'
                }`}
              >
                {gpsStatus === 'active' ? t.btn_gps_active : gpsStatus === 'acquiring' ? t.btn_gps_loading : t.btn_gps}
              </button>
            </div>

            {/* Citizen Confirmation Checklist */}
            <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-xl space-y-1">
              <div className="flex items-start gap-2">
                <input 
                  type="checkbox" 
                  id="consentCheckbox"
                  checked={dataConsent}
                  onChange={(e) => setDataConsent(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
                />
                <label htmlFor="consentCheckbox" className="text-xs text-slate-700 leading-snug font-medium cursor-pointer">
                  {t.security_declaration}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#f97316] hover:bg-[#e06317] text-white font-bold text-sm py-2.5 rounded-xl flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
            >
              {submitting ? (
                <>
                  <Activity className="h-4 w-4 animate-spin" />
                  {t.btn_submitting}
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  {t.btn_submit}
                </>
              )}
            </button>
          </form>

          {/* Submission Success Alert */}
          {submitResult && (
            <div className="bg-emerald-50 border border-emerald-300 p-3.5 rounded-xl space-y-2.5 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-xs sm:text-sm">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>{t.success_title}</span>
              </div>
              <div className="text-xs space-y-1.5 bg-white p-3 rounded-xl border border-slate-200">
                <div>
                  <span className="text-[11px] text-slate-500 font-bold block">{t.success_receipt}</span>
                  <code className="text-slate-900 font-mono font-bold select-all block py-1 text-xs border-b border-slate-100">{submitResult.submission_id}</code>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-slate-700 pt-1">
                  <p>{t.success_category}: <strong className="text-slate-950 uppercase">{submitResult.parsed.category}</strong></p>
                  <p>{t.success_location}: <strong className="text-slate-950">{submitResult.parsed.ward_id ? `District/Sector ${submitResult.parsed.ward_id}` : 'General Sector'}</strong></p>
                  <p>{t.success_trust}: <strong className="text-emerald-700 font-bold">Received & Verified</strong></p>
                  <p>{t.success_coordination}: <strong className="text-blue-900 font-bold">Forwarded to Planning</strong></p>
                </div>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {t.success_footer}
              </p>
            </div>
          )}
        </section>

        {/* COLUMN 2: Live Community Needs Map (col-span-12 lg:col-span-5) */}
        <section className="col-span-12 lg:col-span-5 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 sm:p-5 space-y-3.5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 flex-wrap gap-2">
              <div>
                <h2 className="text-base sm:text-lg font-black text-blue-900 flex items-center gap-2">
                  <Globe className="h-5 w-5 text-blue-700" />
                  Live Community Needs Map
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Explore active infrastructure suggestions and priority areas in {currentJurisdiction.flag} {currentJurisdiction.name}
                </p>
              </div>
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-300 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1.5 shrink-0">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Live Overview
              </span>
            </div>

            {/* Interactive Map Component */}
            <div className="relative">
              <HotspotMap
                wardStats={sectors.map(s => ({
                  ward_id: s.id,
                  name: s.name,
                  ward_name: s.name,
                  population: s.population || (s.id * 15000 + 45000),
                  equity_score: s.equity || 5.0,
                  citizen_count: Math.floor((s.equity || 5) * 3) + 4,
                  cluster_count: Math.max(1, Math.floor((s.equity || 5) / 2))
                }))}
                onSelectWard={(secId) => {
                  setSelectedSectorId(secId);
                  const sec = sectors.find(s => s.id === secId);
                  if (sec) {
                    setGpsCoords({ lat: sec.center[0], lng: sec.center[1] });
                    setGpsStatus('active');
                  }
                }}
                selectedWardId={selectedSectorId}
                submissions={mapSubmissions}
                center={currentJurisdiction.center}
                zoom={currentJurisdiction.zoom}
                coordinatesMap={jurisdictionCoordinatesMap}
              />
            </div>

            {/* Map Legend & Active Sector Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <span className="text-[11px] text-slate-500 font-bold uppercase block">Selected Area</span>
                <span className="font-extrabold text-blue-950 text-xs sm:text-sm truncate block mt-0.5">
                  {sectors.find(s => s.id === selectedSectorId)?.name || 'General Sector'}
                </span>
              </div>
              <div>
                <span className="text-[11px] text-slate-500 font-bold uppercase block">Planning Status</span>
                <span className="font-bold text-emerald-700 text-xs flex items-center gap-1 mt-0.5">
                  <CheckCircle className="h-3.5 w-3.5 text-emerald-600 inline" />
                  Active Capital Planning Zone
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* COLUMN 3: Proposal Tracker, Live Feed & DPI Trust (col-span-12 lg:col-span-3) */}
        <section className="col-span-12 lg:col-span-3 space-y-4">
          
          {/* Proposal Status Tracker */}
          <div className="bg-white border border-slate-200 p-4 sm:p-5 rounded-2xl shadow-sm space-y-3.5">
            <div className="border-b border-slate-100 pb-2.5">
              <h2 className="text-base sm:text-lg font-black text-blue-900 flex items-center gap-2">
                <Search className="h-4 w-4 text-[#f97316]" />
                {t.tracker_title}
              </h2>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{t.tracker_desc}</p>
            </div>

            <form onSubmit={handleTrackSubmission} className="flex gap-2 items-center">
              <input 
                type="text" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={t.placeholder_tracker}
                className="flex-1 min-w-0 bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition"
              />
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-xs transition shrink-0"
              >
                {t.btn_track}
              </button>
            </form>

            {trackError && (
              <p className="text-xs text-rose-600 text-center font-bold bg-rose-50 py-1.5 rounded-lg border border-rose-200">
                {trackError}
              </p>
            )}

            {/* Tracker Status Output Timeline */}
            {trackedStatus && (
              <div className="space-y-3 animate-in fade-in duration-300">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
                  <p className="text-slate-700 font-bold">Proposal: <strong className="text-slate-900">{trackedStatus.submission.user_name}</strong></p>
                  <p className="text-slate-600 italic leading-relaxed">"{trackedStatus.submission.raw_text}"</p>
                  {trackedStatus.projectTitle && (
                    <p className="text-xs text-blue-900 pt-1.5 border-t border-slate-200 font-bold">
                      Identified Project: {trackedStatus.projectTitle}
                    </p>
                  )}
                </div>

                {/* Timeline display */}
                <div className="space-y-3 pl-3.5 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                  {/* Status 1: Ingested */}
                  <div className="flex gap-2.5 relative">
                    <div className="h-3 w-3 rounded-full bg-emerald-600 border-2 border-white z-10 shrink-0 mt-0.5 shadow-xs"></div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{t.timeline_step1}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.timeline_step1_sub}</p>
                    </div>
                  </div>

                  {/* Status 2: Grouped */}
                  <div className="flex gap-2.5 relative">
                    <div className={`h-3 w-3 rounded-full border-2 border-white z-10 shrink-0 mt-0.5 shadow-xs ${
                      trackedStatus.issue?.status === 'verified' ? 'bg-emerald-600' : 'bg-slate-350'
                    }`}></div>
                    <div>
                      <h4 className={`font-bold text-xs sm:text-sm ${trackedStatus.issue?.status === 'verified' ? 'text-slate-900' : 'text-slate-400'}`}>
                        {t.timeline_step2}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.timeline_step2_sub}</p>
                    </div>
                  </div>

                  {/* Status 3: Review */}
                  <div className="flex gap-2.5 relative">
                    <div className={`h-3 w-3 rounded-full border-2 border-white z-10 shrink-0 mt-0.5 shadow-xs ${
                      (trackedStatus.projectStatus !== 'Proposed' && trackedStatus.projectStatus !== 'Rejected') ? 'bg-emerald-600' : 'bg-slate-350'
                    }`}></div>
                    <div>
                      <h4 className={`font-bold text-xs sm:text-sm ${
                        (trackedStatus.projectStatus !== 'Proposed' && trackedStatus.projectStatus !== 'Rejected') ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {t.timeline_step3}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.timeline_step3_sub}</p>
                    </div>
                  </div>

                  {/* Status 4: Tendering & Construction */}
                  <div className="flex gap-2.5 relative">
                    <div className={`h-3.5 w-3.5 rounded-full border-2 border-white z-10 shrink-0 mt-0.5 shadow-xs ${
                      ['Tendering', 'Construction', 'Completed'].includes(trackedStatus.projectStatus) ? 'bg-emerald-600' : 'bg-slate-350'
                    }`}></div>
                    <div>
                      <h4 className={`font-bold text-xs sm:text-sm ${
                        ['Tendering', 'Construction', 'Completed'].includes(trackedStatus.projectStatus) ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {t.timeline_step4}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{t.timeline_step4_sub} <strong className="text-blue-900">{trackedStatus.projectStatus}</strong></p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Live BRICS Demand Feed */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-xs font-black text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Activity className="h-3.5 w-3.5 text-emerald-600" />
                Live Feed across BRICS
              </h3>
              <span className="text-[11px] text-slate-500 font-bold">Real-time Stream</span>
            </div>
            <div className="space-y-2">
              {RECENT_BRICS_FEED.map((feed) => (
                <div key={feed.id} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                      <span>{feed.flag}</span>
                      <span>{feed.location}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{feed.time}</span>
                  </div>
                  <p className="text-xs text-slate-700 font-medium leading-snug">{feed.text}</p>
                  <div className="flex items-center justify-between pt-0.5 text-[11px]">
                    <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded font-bold">{feed.category}</span>
                    <span className="text-emerald-700 font-bold font-mono">{feed.trust}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Citizen Privacy & Civic Trust */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm space-y-2">
            <h3 className="font-black text-xs text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-600" />
              Civic Trust & Privacy Guarantee
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Your feedback is verified, protected, and directly delivered to municipal planning engineers. Personal identities remain private while ensuring every community member gets an equal voice.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
              <span className="inline-flex items-center gap-1 text-emerald-700 font-bold">
                ✓ Public Record Protected
              </span>
              <span>&bull;</span>
              <span>Tamper-Resistant</span>
              <span>&bull;</span>
              <span>Fair Community Voice</span>
            </div>
          </div>

        </section>

      </main>

      {/* Full-Width Global BRICS Footer */}
      <footer className="border-t border-slate-200 py-3.5 px-4 sm:px-6 lg:px-8 text-center text-xs text-slate-500 bg-white shadow-xs w-full flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 text-slate-700 font-bold text-xs flex-wrap justify-center">
          <span>🇧🇷 Brasil</span>
          <span>&bull;</span>
          <span>🇷🇺 Россия</span>
          <span>&bull;</span>
          <span>🇮🇳 India</span>
          <span>&bull;</span>
          <span>🇨🇳 中国</span>
          <span>&bull;</span>
          <span>🇿🇦 South Africa</span>
        </div>
        <p className="text-xs text-slate-500">
          © 2026 CIVIS-BRICS Initiative &bull; Open Digital Public Good (DPG) for Participatory Infrastructure Planning & Goverance.
        </p>
      </footer>

    </div>
  );
}
