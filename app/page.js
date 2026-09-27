// app/page.js
'use client';

import { useState, useEffect, useRef } from 'react';
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
  Activity,
  User,
  Landmark
} from 'lucide-react';
import { supabase } from '@/lib/supabase';

// Multilingual Translation Matrix across all BRICS member nations
const LANG_DICTS = {
  en: {
    header_title: "CIVIS-BRICS — Citizen Development Planning",
    header_subtitle: "Digital Public Good for Participatory Infrastructure",
    header_org: "UN DPG Standard & BRICS Innovation DPI Initiative",
    btn_mp_workspace: "Policymaker Workspace →",
    form_title: "Civic Development Proposal",
    form_desc: "Submit suggestions in English, Hindi, Mandarin, Russian, Portuguese, or Marathi. All inputs are mapped to sovereign planning databases.",
    label_name: "Citizen Full Name",
    placeholder_name: "Enter your full name",
    label_suggestion: "Development Suggestion Details",
    placeholder_suggestion: "Describe the issue or proposed upgrade (e.g. school capacity issues, road potholes, water shortages, healthcare clinics)...",
    demo_scenario: "Load Demo Scenario",
    btn_voice_start: "Record Audio",
    btn_voice_active: "Listening Speech...",
    btn_audio_active: "Recording Audio Note...",
    btn_voice_attached: "Audio Attached",
    btn_photo_scan: "Upload Photo",
    btn_photo_scanning: "Scanning Image...",
    btn_photo_attached: "Photo Attached",
    label_gps: "Geo-Location Verification",
    label_gps_desc: "Pinpoint coordinates for spatial equity & GIS clustering",
    btn_gps: "Verify Location",
    btn_gps_active: "GPS Tagged",
    btn_gps_loading: "Locating...",
    security_declaration: "Security Declaration: I certify that the information provided is correct. I consent to the collection of coordinates and media files for audit and planning purposes. All data is protected under UN Digital Public Good (DPG) and sovereign data protection standards.",
    btn_submit: "Submit Suggestion",
    btn_submitting: "Subword translation & verification active...",
    success_title: "Grievance Ingested Successfully!",
    success_receipt: "Your Official Tracking ID:",
    success_category: "Category",
    success_location: "Jurisdiction",
    success_trust: "Evidence Trust",
    success_coordination: "Campaign Filter",
    success_campaign_yes: "Campaign Dampened",
    success_campaign_no: "Organic Demand",
    success_footer: "Your suggestion has been translated, verified, and mapped into the national spatial cluster engine. Use your tracking receipt ID to monitor status.",
    tracker_title: "Track Proposal Status",
    tracker_desc: "Check progress, planning status, and implementation updates for your submission ID.",
    placeholder_tracker: "Enter Receipt ID (e.g. sub-init-1)",
    btn_track: "Search",
    timeline_step1: "1. Ingested & Cryptographically Hashed",
    timeline_step1_sub: "Receipt generated, translation completed.",
    timeline_step2: "2. Verified & Spatially Clustered",
    timeline_step2_sub: "Category verified, astroturf coordination scored, spatial centroid mapped.",
    timeline_step3: "3. Policymaker Optimization & Budget Sanction",
    timeline_step3_sub: "Evaluated against multi-indicator Pareto frontier.",
    timeline_step4: "4. Implementation & Public Audit",
    timeline_step4_sub: "Current project state:",
    nic_compliance_title: "Digital Public Good (DPG) & DPI Trust Architecture",
    nic_compliance_desc: "Sovereign data integrity: All user submissions are hashed, anti-astroturf coordinated campaigns are algorithmically dampened, and municipal resource allocations generate transparent cryptographic audit trails.",
    footer_text: "© 2026 CIVIS-BRICS Initiative. Digital Public Good for Infrastructure & Governance."
  },
  hi: {
    header_title: "CIVIS-BRICS — नागरिक विकास योजना पोर्टल",
    header_subtitle: "सहभागी बुनियादी ढांचे के लिए डिजिटल सार्वजनिक वस्तु",
    header_org: "संयुक्त राष्ट्र डीपीजी मानक एवं ब्रिक्स नवाचार डीपीआई पहल",
    btn_mp_workspace: "नीति निर्माता डैशबोर्ड →",
    form_title: "नागरिक विकास प्रस्ताव फॉर्म",
    form_desc: "बुनियादी ढांचे और सार्वजनिक कार्यों के प्रस्ताव अपनी भाषा में प्रस्तुत करें। एआई सत्यापन कर इसे संप्रभु योजना पाइपलाइन में मैप करता है।",
    label_name: "नागरिक का पूरा नाम",
    placeholder_name: "अपना पूरा नाम दर्ज करें",
    label_suggestion: "विकास प्रस्ताव का विवरण",
    placeholder_suggestion: "समस्या या प्रस्तावित सुधार का वर्णन करें (जैसे स्कूल, सड़क, जलापूर्ति, स्वास्थ्य केंद्र)...",
    demo_scenario: "डेमो परिदृश्य लोड करें",
    btn_voice_start: "आवाज रिकॉर्ड करें",
    btn_voice_active: "भाषण सुन रहे हैं...",
    btn_audio_active: "ऑडियो रिकॉर्ड हो रहा है...",
    btn_voice_attached: "ऑडियो संलग्न किया गया",
    btn_photo_scan: "फोटो अपलोड करें",
    btn_photo_scanning: "फोटो स्कैन हो रहा है...",
    btn_photo_attached: "फोटो संलग्न किया गया",
    label_gps: "भू-स्थान सत्यापन",
    label_gps_desc: "सत्यापन और ऑडिट के लिए सटीक स्थान दर्ज करें",
    btn_gps: "स्थान सत्यापित करें",
    btn_gps_active: "स्थान टैग किया गया",
    btn_gps_loading: "खोज रहे हैं...",
    security_declaration: "सुरक्षा घोषणा: मैं प्रमाणित करता/करती हूं कि प्रदान की गई जानकारी सही है। मैं संप्रभु डेटा सुरक्षा नियमों के तहत सत्यापन और योजना के लिए सहमति देता/देती हूं।",
    btn_submit: "प्रस्ताव सबमिट करें",
    btn_submitting: "अनुवाद और सत्यापन सक्रिय है...",
    success_title: "प्रस्ताव सफलतापूर्वक दर्ज किया गया!",
    success_receipt: "आपका आधिकारिक ट्रैकिंग आईडी:",
    success_category: "श्रेणी / सेक्टर",
    success_location: "प्रशासनिक क्षेत्र",
    success_trust: "विश्वसनीयता सूचकांक",
    success_coordination: "अभियान सत्यापन",
    success_campaign_yes: "अभियान नियंत्रित",
    success_campaign_no: "स्वाभाविक मांग",
    success_footer: "आपके प्रस्ताव का अनुवाद, सत्यापन और क्लस्टर मैपिंग पूरा हो चुका है। प्रगति की निगरानी के लिए ट्रैकिंग आईडी का उपयोग करें।",
    tracker_title: "प्रस्ताव की स्थिति ट्रैक करें",
    tracker_desc: "प्रगति, नियोजन स्थिति और कार्यान्वयन अपडेट की जांच के लिए अपना आईडी दर्ज करें।",
    placeholder_tracker: "रसीद आईडी दर्ज करें (जैसे sub-init-1)",
    btn_track: "खोजें",
    timeline_step1: "१. शिकायत दर्ज व हैश प्रमाणित",
    timeline_step1_sub: "रसीद जनरेट की गई, अनुवाद पूरा हुआ।",
    timeline_step2: "२. सत्यापित और क्लस्टर में समूहीकृत",
    timeline_step2_sub: "श्रेणी सत्यापन, समन्वय स्कोर और स्थानिक केंद्र मैपिंग पूर्ण।",
    timeline_step3: "३. नीति निर्माता अनुकूलन एवं बजट आवंटन",
    timeline_step3_sub: "बहु-सूचक पारेतो फ्रंटियर के आधार पर स्वीकृत।",
    timeline_step4: "४. कार्यान्वयन एवं सार्वजनिक ऑडिट चरण",
    timeline_step4_sub: "वर्तमान परियोजना की स्थिति:",
    nic_compliance_title: "डिजिटल पब्लिक गुड (DPG) एवं डीपीआई सुरक्षा मानक",
    nic_compliance_desc: "संप्रभु डेटा अखंडता: सभी प्रस्तुतियां एन्क्रिप्टेड हैं, स्पैम अभियानों को एल्गोरिथ्म द्वारा नियंत्रित किया जाता है, और पारदर्शी सार्वजनिक ऑडिट सुनिश्चित की जाती है।",
    footer_text: "© २०२६ CIVIS-BRICS पहल। बुनियादी ढांचे और सुशासन के लिए डिजिटल सार्वजनिक संपत्ति।"
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

const DEMO_CASES = {
  en: {
    name: "Elena Rostova",
    text: "District 3 primary school has severe overcrowding, children lack classroom desks. Need urgent school wing expansion.",
    lat: -23.5505,
    lng: -46.6333
  },
  mr: {
    name: "प्रिया शिंदे",
    text: "वॉर्ड ३ मध्ये शाळा खूप लहान आहे, मुलांना बसायला जागा नाही. नवीन वर्गखोल्या बांधा.",
    lat: 18.488,
    lng: 73.896
  },
  hi: {
    name: "प्रियंका शर्मा",
    text: "वार्ड 3 में प्राथमिक विद्यालय बहुत छोटा है, बच्चों के बैठने की जगह नहीं है। नए कमरों का निर्माण करें।",
    lat: 18.5204,
    lng: 73.8567
  },
  pt: {
    name: "Lucas Silva",
    text: "No Distrito 3, a escola primária está superlotada e sem carteiras suficientes. Precisamos da expansão urgente das salas de aula.",
    lat: -23.5505,
    lng: -46.6333
  },
  ru: {
    name: "Алексей Иванов",
    text: "В Районе 3 начальная школа переполнена, детям не хватает парт. Требуется срочное расширение учебных классов.",
    lat: 55.7558,
    lng: 37.6173
  },
  zh: {
    name: "张伟",
    text: "第3区小学教室严重拥挤，学生缺少课桌。急需扩建新教学楼和课室。",
    lat: 31.2304,
    lng: 121.4737
  }
};

export default function CitizenPortal() {
  // Multilingual active state
  const [currentLang, setCurrentLang] = useState('en'); // en, mr, hi
  const t = LANG_DICTS[currentLang];
  
  // Audio recording refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);

  // Submission Form State
  const [userName, setUserName] = useState('');
  const [suggestionText, setSuggestionText] = useState('');
  const [gpsCoords, setGpsCoords] = useState(null);
  const [gpsStatus, setGpsStatus] = useState('inactive'); // inactive, acquiring, active, failed
  const [dataConsent, setDataConsent] = useState(false);
  
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
  const [searchId, setSearchId] = useState('');
  const [trackedStatus, setTrackedStatus] = useState(null);
  const [trackError, setTrackError] = useState(null);

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

  // Mock/Real OCR scanning on photo upload
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
          gps_lng: gpsCoords?.lng
        })
      });
      const data = await res.json();
      if (data.success) {
        setSubmitResult(data);
        // Reset form
        setSuggestionText('');
        setVoiceUrl(null);
        setImageUrl(null);
        setGpsCoords(null);
        setGpsStatus('inactive');
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

  const loadDemoScenario = () => {
    const demo = DEMO_CASES[currentLang] || DEMO_CASES.en;
    setUserName(demo.name);
    setSuggestionText(demo.text);
    setGpsCoords({ lat: demo.lat, lng: demo.lng });
    setGpsStatus('active');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 font-sans min-h-screen">
      
      {/* BRICS Digital Public Infrastructure Multi-Nation Gradient Stripe */}
      <div className="h-2 w-full bg-gradient-to-r from-blue-700 via-emerald-600 via-amber-500 to-rose-600"></div>

      {/* Official DPG Header */}
      <header className="border-b border-slate-200 bg-white px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 shrink-0 shadow-sm">
            <Landmark className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-blue-900 tracking-tight">
              {t.header_title}
            </h1>
            <h2 className="text-md font-bold text-slate-700">
              {t.header_subtitle}
            </h2>
            <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider">{t.header_org}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 flex-wrap">
          {/* Multilingual Selector Toggles */}
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-300 flex-wrap gap-1">
            {[
              { code: 'en', label: 'English' },
              { code: 'hi', label: 'हिन्दी' },
              { code: 'zh', label: '中文' },
              { code: 'ru', label: 'Русский' },
              { code: 'pt', label: 'Português' },
              { code: 'mr', label: 'मराठी' }
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => setCurrentLang(l.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition ${
                  currentLang === l.code ? 'bg-blue-900 text-white shadow-sm' : 'text-slate-650 hover:text-slate-900'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>

          <Link
            href="/mp"
            className="text-sm bg-blue-900 hover:bg-blue-800 text-white font-extrabold px-5 py-2.5 rounded-xl shadow-md transition"
          >
            {t.btn_mp_workspace}
          </Link>
        </div>
      </header>

      {/* Main Body */}
      <main className="flex-1 max-w-5xl mx-auto w-full p-6 lg:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
        
        {/* LEFT COLUMN: Input Form */}
        <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-black text-blue-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#f97316]" />
              {t.form_title}
            </h2>
            <p className="text-xs text-slate-500 mt-1">{t.form_desc}</p>
          </div>

          <form onSubmit={handleSubmitSuggestion} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-bold text-slate-700 flex items-center gap-1.5">
                <User className="h-4 w-4 text-slate-500" />
                {t.label_name} <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                placeholder={t.placeholder_name}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition"
                required
              />
            </div>

            {/* Suggestion Text */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-slate-700">
                  {t.label_suggestion} <span className="text-red-500">*</span>
                </label>
                <button
                  type="button"
                  onClick={loadDemoScenario}
                  className="text-xs text-blue-900 hover:text-blue-700 font-extrabold underline"
                >
                  {t.demo_scenario}
                </button>
              </div>
              <textarea 
                rows="4"
                value={suggestionText}
                onChange={(e) => setSuggestionText(e.target.value)}
                placeholder={t.placeholder_suggestion}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-4 py-3 text-base text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition"
                required
              />
            </div>

            {/* Media Attachment buttons */}
            <div className="flex items-center gap-3">
              {/* Voice Note Recording Button */}
              <button
                type="button"
                onClick={toggleRecording}
                className={`flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition ${
                  isRecording 
                    ? 'bg-rose-50 border-rose-300 text-rose-600 animate-pulse' 
                    : voiceUrl 
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                {isRecording ? (recordingMode === 'speech' ? t.btn_voice_active : t.btn_audio_active) : voiceUrl ? t.btn_voice_attached : t.btn_voice_start}
              </button>

              {/* Photo Upload Trigger */}
              <label className={`flex-1 py-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition ${
                imageScanning 
                  ? 'bg-amber-50 border-amber-300 text-amber-600' 
                  : imageUrl 
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-700'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
              }`}>
                <Image className="h-4 w-4" />
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

            {/* GPS verification block */}
            <div className="flex items-center justify-between bg-slate-50 p-3.5 rounded-xl border border-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className={`h-5 w-5 ${gpsStatus === 'active' ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div>
                  <span className="text-xs font-bold text-slate-800 block">{t.label_gps}</span>
                  <span className="text-[10px] text-slate-500 block">{t.label_gps_desc}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={handleGPSAcquisition}
                disabled={gpsStatus === 'acquiring' || gpsStatus === 'active'}
                className={`px-4 py-2 rounded-lg text-xs font-extrabold transition ${
                  gpsStatus === 'active' 
                    ? 'bg-emerald-100 border border-emerald-300 text-emerald-700' 
                    : gpsStatus === 'acquiring'
                      ? 'bg-slate-200 text-slate-500 animate-pulse'
                      : 'bg-blue-900 hover:bg-blue-800 text-white shadow-sm'
                }`}
              >
                {gpsStatus === 'active' ? t.btn_gps_active : gpsStatus === 'acquiring' ? t.btn_gps_loading : t.btn_gps}
              </button>
            </div>

            {/* Security Declaration Checklist & Consent */}
            <div className="bg-blue-50/50 border border-blue-200 p-4 rounded-xl space-y-2">
              <div className="flex items-start gap-2.5">
                <input 
                  type="checkbox" 
                  id="consentCheckbox"
                  checked={dataConsent}
                  onChange={(e) => setDataConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                />
                <label htmlFor="consentCheckbox" className="text-xs text-slate-700 leading-relaxed font-semibold cursor-pointer">
                  {t.security_declaration}
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#f97316] hover:bg-[#e06317] text-white font-black text-base py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-md transition"
            >
              {submitting ? (
                <>
                  <Activity className="h-5 w-5 animate-spin" />
                  {t.btn_submitting}
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  {t.btn_submit}
                </>
              )}
            </button>
          </form>

          {/* Submission Success Alert */}
          {submitResult && (
            <div className="bg-emerald-50 border border-emerald-300 p-4 rounded-xl space-y-3 animate-in fade-in duration-300">
              <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm">
                <CheckCircle className="h-5 w-5 shrink-0" />
                <span>{t.success_title}</span>
              </div>
              <div className="text-sm space-y-2 bg-white p-3.5 rounded-lg border border-slate-200">
                <div>
                  <span className="text-xs text-slate-500 font-bold">{t.success_receipt}</span>
                  <code className="text-slate-900 font-mono font-bold select-all block py-1.5 text-sm border-b border-slate-100">{submitResult.submission_id}</code>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs text-slate-700 pt-1.5">
                  <p>{t.success_category}: <strong className="text-slate-950 uppercase">{submitResult.parsed.category}</strong></p>
                  <p>{t.success_location}: <strong className="text-slate-950">{submitResult.parsed.ward_id ? `District/Ward ${submitResult.parsed.ward_id}` : 'General Pool'}</strong></p>
                  <p>{t.success_trust}: <strong className="text-emerald-700">{submitResult.parsed.trust_score.toFixed(1)}/10</strong></p>
                  <p>{t.success_coordination}: <strong className="text-slate-950">{submitResult.parsed.is_campaign ? t.success_campaign_yes : t.success_campaign_no}</strong></p>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {t.success_footer}
              </p>
            </div>
          )}
        </section>

        {/* RIGHT COLUMN: Feedback & Tracker */}
        <div className="space-y-6">
          
          {/* Tracker Card */}
          <section className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md space-y-5">
            <div className="border-b border-slate-100 pb-3">
              <h2 className="text-lg font-black text-blue-900 flex items-center gap-2">
                <Search className="h-5 w-5 text-[#f97316]" />
                {t.tracker_title}
              </h2>
              <p className="text-xs text-slate-500 mt-1">{t.tracker_desc}</p>
            </div>

            <form onSubmit={handleTrackSubmission} className="flex gap-2 items-center">
              <input 
                type="text" 
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder={t.placeholder_tracker}
                className="flex-1 min-w-0 bg-slate-50 border border-slate-300 rounded-xl px-4 py-2.5 text-base text-slate-950 placeholder-slate-400 focus:outline-none focus:border-blue-900 focus:bg-white transition"
              />
              <button
                type="submit"
                className="bg-blue-900 hover:bg-blue-800 text-white px-5 rounded-xl font-bold text-xs shadow-sm transition"
              >
                {t.btn_track}
              </button>
            </form>

            {trackError && (
              <p className="text-xs text-rose-600 text-center font-bold bg-rose-50 py-2 rounded-lg border border-rose-200">
                {trackError}
              </p>
            )}

            {/* Tracker Status Output Timeline */}
            {trackedStatus && (
              <div className="space-y-4 animate-in fade-in duration-300">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
                  <p className="text-slate-650 font-bold">Proposal Sender: <strong className="text-slate-900">{trackedStatus.submission.user_name}</strong></p>
                  <p className="text-slate-650 italic">"{trackedStatus.submission.raw_text}"</p>
                  {trackedStatus.projectTitle && (
                    <p className="text-xs text-blue-900 pt-2 border-t border-slate-200 font-bold">
                      Cluster Node: {trackedStatus.projectTitle}
                    </p>
                  )}
                </div>

                {/* Timeline display */}
                <div className="space-y-4 pl-4 relative before:absolute before:left-3.5 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                  
                  {/* Status 1: Ingested */}
                  <div className="flex gap-3.5 relative">
                    <div className="h-3.5 w-3.5 rounded-full bg-emerald-600 border-4 border-white z-10 shrink-0 mt-0.5 shadow-sm"></div>
                    <div className="text-xs">
                      <h4 className="font-extrabold text-slate-900">{t.timeline_step1}</h4>
                      <p className="text-[10px] text-slate-500">{t.timeline_step1_sub}</p>
                    </div>
                  </div>

                  {/* Status 2: Grouped */}
                  <div className="flex gap-3.5 relative">
                    <div className={`h-3.5 w-3.5 rounded-full border-4 border-white z-10 shrink-0 mt-0.5 shadow-sm ${
                      trackedStatus.issue?.status === 'verified' ? 'bg-emerald-600' : 'bg-slate-350'
                    }`}></div>
                    <div className="text-xs">
                      <h4 className={`font-extrabold ${trackedStatus.issue?.status === 'verified' ? 'text-slate-900' : 'text-slate-400'}`}>
                        {t.timeline_step2}
                      </h4>
                      <p className="text-[10px] text-slate-500">{t.timeline_step2_sub}</p>
                    </div>
                  </div>

                  {/* Status 3: MP Review */}
                  <div className="flex gap-3.5 relative">
                    <div className={`h-3.5 w-3.5 rounded-full border-4 border-white z-10 shrink-0 mt-0.5 shadow-sm ${
                      (trackedStatus.projectStatus !== 'Proposed' && trackedStatus.projectStatus !== 'Rejected') ? 'bg-emerald-600' : 'bg-slate-350'
                    }`}></div>
                    <div className="text-xs">
                      <h4 className={`font-extrabold ${
                        (trackedStatus.projectStatus !== 'Proposed' && trackedStatus.projectStatus !== 'Rejected') ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {t.timeline_step3}
                      </h4>
                      <p className="text-[10px] text-slate-500">{t.timeline_step3_sub}</p>
                    </div>
                  </div>

                  {/* Status 4: Tendering & Construction */}
                  <div className="flex gap-3.5 relative">
                    <div className={`h-3.5 w-3.5 rounded-full border-4 border-white z-10 shrink-0 mt-0.5 shadow-sm ${
                      ['Tendering', 'Construction', 'Completed'].includes(trackedStatus.projectStatus) ? 'bg-emerald-600' : 'bg-slate-350'
                    }`}></div>
                    <div className="text-xs">
                      <h4 className={`font-extrabold ${
                        ['Tendering', 'Construction', 'Completed'].includes(trackedStatus.projectStatus) ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        {t.timeline_step4}
                      </h4>
                      <p className="text-[10px] text-slate-500">{t.timeline_step4_sub} <strong>{trackedStatus.projectStatus}</strong></p>
                    </div>
                  </div>

                </div>
              </div>
            )}
          </section>

          {/* Secure Audit Information Card */}
          <section className="bg-white border border-slate-200 p-5 rounded-2xl shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs text-blue-900 uppercase tracking-wider flex items-center gap-2">
              <Shield className="h-4 w-4 text-[#f97316]" />
              {t.nic_compliance_title}
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-semibold">
              {t.nic_compliance_desc}
            </p>
          </section>

        </div>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-6 text-center text-xs text-slate-500 bg-white shadow-inner">
        <p>{t.footer_text}</p>
      </footer>

    </div>
  );
}
