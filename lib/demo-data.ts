// LexPro Demo Data - Lopez Garcia Cano Abogados

export type UserRole = "admin" | "abogado"

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar: string
}

export interface Client {
  id: string
  name: string
  contactName: string
  email: string
  phone: string
  address: string
  projectCount: number
}

// Main divisions
export type MainDivision = "Fiscal" | "Corporativo"

// Subcategories under each division
export type FiscalSubcategory = "Litigio Fiscal" | "Consultoria Fiscal" | "Procedimientos Administrativos" | "Materialidad"
export type CorporativoSubcategory = "Societario" | "Contractual"

export type ProjectCategory = FiscalSubcategory | CorporativoSubcategory

export const divisionMap: Record<ProjectCategory, MainDivision> = {
  "Litigio Fiscal": "Fiscal",
  "Consultoria Fiscal": "Fiscal",
  "Procedimientos Administrativos": "Fiscal",
  "Materialidad": "Fiscal",
  "Societario": "Corporativo",
  "Contractual": "Corporativo",
}

export const fiscalCategories: FiscalSubcategory[] = [
  "Litigio Fiscal",
  "Consultoria Fiscal",
  "Procedimientos Administrativos",
  "Materialidad",
]

export const corporativoCategories: CorporativoSubcategory[] = [
  "Societario",
  "Contractual",
]

export const allCategories: ProjectCategory[] = [...fiscalCategories, ...corporativoCategories]

// Colors per subcategory - each with unique color
export const categoryColors: Record<ProjectCategory, string> = {
  "Litigio Fiscal": "bg-red-100 text-red-800 border-red-300",
  "Consultoria Fiscal": "bg-sky-100 text-sky-800 border-sky-300",
  "Procedimientos Administrativos": "bg-amber-100 text-amber-800 border-amber-300",
  "Materialidad": "bg-violet-100 text-violet-800 border-violet-300",
  "Societario": "bg-emerald-100 text-emerald-800 border-emerald-300",
  "Contractual": "bg-indigo-100 text-indigo-800 border-indigo-300",
}

// Subtle card background tints per category (inline styles to avoid Tailwind purge)
export const categoryBgColors: Record<ProjectCategory, { backgroundColor: string; borderColor: string }> = {
  "Litigio Fiscal": { backgroundColor: "rgba(254, 226, 226, 0.6)", borderColor: "rgba(252, 165, 165, 0.5)" },
  "Consultoria Fiscal": { backgroundColor: "rgba(224, 242, 254, 0.6)", borderColor: "rgba(125, 211, 252, 0.5)" },
  "Procedimientos Administrativos": { backgroundColor: "rgba(254, 243, 199, 0.6)", borderColor: "rgba(252, 211, 77, 0.5)" },
  "Materialidad": { backgroundColor: "rgba(237, 233, 254, 0.6)", borderColor: "rgba(196, 181, 253, 0.5)" },
  "Societario": { backgroundColor: "rgba(209, 250, 229, 0.6)", borderColor: "rgba(110, 231, 183, 0.5)" },
  "Contractual": { backgroundColor: "rgba(224, 231, 255, 0.6)", borderColor: "rgba(165, 180, 252, 0.5)" },
}

export const categoryDotColors: Record<ProjectCategory, string> = {
  "Litigio Fiscal": "#ef4444",
  "Consultoria Fiscal": "#0ea5e9",
  "Procedimientos Administrativos": "#f59e0b",
  "Materialidad": "#8b5cf6",
  "Societario": "#10b981",
  "Contractual": "#6366f1",
}

// Division badge colors
export const divisionColors: Record<MainDivision, string> = {
  Fiscal: "bg-[hsl(216,50%,12%)] text-[hsl(40,50%,90%)] border-[hsl(216,50%,12%)]",
  Corporativo: "bg-[hsl(40,60%,50%)] text-[hsl(216,50%,8%)] border-[hsl(40,60%,50%)]",
}

export type Priority = "Baja" | "Media" | "Alta" | "Critica"
export type TaskStatus = "Pendiente" | "En Progreso" | "Completada" | "Vencida"
export type ProjectStatus = "Activo" | "En Espera" | "Completado"

export const priorityColors: Record<Priority, string> = {
  Baja: "bg-muted text-muted-foreground",
  Media: "bg-sky-100 text-sky-800 border-sky-200",
  Alta: "bg-amber-100 text-amber-800 border-amber-200",
  Critica: "bg-red-100 text-red-800 border-red-200",
}

export const priorityOrder: Record<Priority, number> = {
  Critica: 0,
  Alta: 1,
  Media: 2,
  Baja: 3,
}

export const statusColors: Record<TaskStatus, string> = {
  Pendiente: "bg-muted text-muted-foreground",
  "En Progreso": "bg-sky-100 text-sky-800",
  Completada: "bg-emerald-100 text-emerald-800",
  Vencida: "bg-red-100 text-red-800",
}

export interface Project {
  id: string
  name: string
  clientId: string
  clientName: string
  category: ProjectCategory
  status: ProjectStatus
  priority: Priority
  assignedTo: string[]
  dueDate: string
  juzgado?: string
  expediente?: string
  description: string
  avance: string
  startDate: string
  progress: number
  budget: number
  team: string[]
}

export interface TaskAlert {
  date: string
  time: string
}

export interface ProgressUpdate {
  id: string
  date: string
  content: string
  author: string
}

export interface Task {
  id: string
  title: string
  projectId: string
  projectName: string
  assignedTo: string
  assignedToName: string
  priority: Priority
  status: TaskStatus
  dueDate: string
  description: string
  hoursLogged: number
  alerts: TaskAlert[]
  avance: string // kept for compatibility, serves as "latest status" or summary
  progressUpdates: ProgressUpdate[]
}

export interface TimeEntry {
  id: string
  taskId: string
  taskTitle: string
  projectName: string
  userId: string
  userName: string
  date: string
  hours: number
  billable: boolean
  description: string
}

export interface Notification {
  id: string
  type: "vencimiento" | "asignacion" | "recordatorio"
  title: string
  message: string
  date: string
  read: boolean
  targetRole?: "admin" | "abogado"
  linkTo?: string
}

// Demo Users - Lopez Garcia Cano partners + associates
export const users: User[] = [
  { id: "u1", name: "Administrador", email: "juanfernando@lopezgarciacano.com", role: "admin", avatar: "AD" },
  { id: "u2", name: "Lic. Andoni Zurita Barrenechea", email: "andoni@lopezgarciacano.com", role: "admin", avatar: "AZ" },
  { id: "u3", name: "Abogado", email: "arturo@lopezgarciacano.com", role: "abogado", avatar: "AB" },
  { id: "u4", name: "Lic. Maria Lopez Gutierrez", email: "maria@lopezgarciacano.com", role: "abogado", avatar: "ML" },
  { id: "u5", name: "Lic. Fernando Reyes Cantu", email: "fernando@lopezgarciacano.com", role: "abogado", avatar: "FR" },
]

// Demo Clients
export const clients: Client[] = [
  { id: "c1", name: "Grupo Industrial del Norte S.A. de C.V.", contactName: "Ing. Jorge Salinas", email: "jsalinas@gin.com.mx", phone: "+52 81 1234 5678", address: "Av. Lazaro Cardenas 1200, Monterrey, NL", projectCount: 3 },
  { id: "c2", name: "Tecnologias Avanzadas S. de R.L.", contactName: "Lic. Patricia Morales", email: "pmorales@tecav.com", phone: "+52 81 2345 6789", address: "Blvd. Diaz Ordaz 340, San Pedro, NL", projectCount: 2 },
  { id: "c3", name: "Constructora Regiomontana S.A.", contactName: "Arq. Miguel Trevino", email: "mtrevino@conreg.mx", phone: "+52 81 3456 7890", address: "Calzada del Valle 500, Monterrey, NL", projectCount: 2 },
  { id: "c4", name: "Alimentos del Pacifico S.A. de C.V.", contactName: "C.P. Laura Ramirez", email: "lramirez@alpac.com.mx", phone: "+52 33 4567 8901", address: "Av. Americas 1500, Guadalajara, JAL", projectCount: 1 },
  { id: "c5", name: "Distribuidora Mexicana S.A.", contactName: "Lic. Eduardo Flores", email: "eflores@dismex.com", phone: "+52 55 5678 9012", address: "Paseo de la Reforma 222, CDMX", projectCount: 2 },
  { id: "c6", name: "Farmaceutica Nacional S.A.", contactName: "Dr. Ricardo Lozano", email: "rlozano@farmnac.mx", phone: "+52 81 6789 0123", address: "Ave. Eugenio Garza Sada 2501, Monterrey, NL", projectCount: 1 },
]

// Demo Projects with new category hierarchy
export const projects: Project[] = [
  { id: "p1", name: "Recurso de Revocacion SAT 2025", clientId: "c1", clientName: "Grupo Industrial del Norte", category: "Litigio Fiscal", status: "Activo", priority: "Critica", assignedTo: ["u3", "u4"], dueDate: "2026-02-20", juzgado: "Tribunal Federal de Justicia Administrativa", expediente: "RF-1234/2025", description: "Recurso de revocacion ante el SAT por diferencias en creditos fiscales del ejercicio 2024.", avance: "Se presentaron agravios ante la autoridad. En espera de resolucion del recurso. Se integraron todas las pruebas documentales.", startDate: "2025-11-15", progress: 65, budget: 150000, team: ["u3", "u4", "u2"] },
  { id: "p2", name: "Fusion Corporativa TecAv-SoftMex", clientId: "c2", clientName: "Tecnologias Avanzadas", category: "Societario", status: "Activo", priority: "Critica", assignedTo: ["u3", "u5"], dueDate: "2026-04-01", description: "Proceso de fusion entre Tecnologias Avanzadas y SoftMex. Incluye due diligence y acta constitutiva.", avance: "Due diligence legal en curso. Se identificaron contingencias laborales menores. Pendiente revision financiera y redaccion de acta de fusion.", startDate: "2025-12-01", progress: 40, budget: 300000, team: ["u3", "u5", "u1", "u4"] },
  { id: "p3", name: "Juicio Nulidad Multa Ambiental", clientId: "c3", clientName: "Constructora Regiomontana", category: "Procedimientos Administrativos", status: "Activo", priority: "Alta", assignedTo: ["u4"], dueDate: "2026-02-28", juzgado: "TFJA - Sala Regional Norte", expediente: "PA-0456/2025", description: "Juicio de nulidad contra multa impuesta por PROFEPA por supuestas violaciones ambientales.", avance: "Demanda de nulidad presentada. Recopilando pruebas periciales y dictamenes ambientales. Audiencia preliminar programada para marzo.", startDate: "2026-01-10", progress: 25, budget: 85000, team: ["u4", "u2"] },
  { id: "p4", name: "Consultoria Planeacion Fiscal", clientId: "c4", clientName: "Alimentos del Pacifico", category: "Consultoria Fiscal", status: "Activo", priority: "Media", assignedTo: ["u5"], dueDate: "2026-03-30", description: "Asesoria en planeacion fiscal y optimizacion de cargas tributarias para el ejercicio 2026.", avance: "Informe de planeacion fiscal entregado al cliente. Pendiente revision final de estrategias de optimizacion tributaria para cierre de ejercicio.", startDate: "2026-01-05", progress: 80, budget: 50000, team: ["u5", "u1"] },
  { id: "p5", name: "Contrato Distribucion Nacional", clientId: "c5", clientName: "Distribuidora Mexicana", category: "Contractual", status: "Activo", priority: "Alta", assignedTo: ["u3", "u4"], dueDate: "2026-03-20", description: "Elaboracion y revision de contrato marco de distribucion a nivel nacional.", avance: "Borrador inicial del contrato marco elaborado. En revision de clausulas de exclusividad territorial y penalizaciones. Pendiente negociacion con contraparte.", startDate: "2026-01-15", progress: 45, budget: 45000, team: ["u3", "u4"] },
  { id: "p6", name: "Revision Materialidad Operaciones", clientId: "c1", clientName: "Grupo Industrial del Norte", category: "Materialidad", status: "Activo", priority: "Alta", assignedTo: ["u5", "u3"], dueDate: "2026-03-15", description: "Revision y acreditacion de materialidad de operaciones con proveedores ante el SAT.", avance: "Analisis de CFDIs y contratos con proveedores en proceso. Se estan integrando las carpetas de evidencia documental para acreditar materialidad.", startDate: "2026-01-20", progress: 30, budget: 95000, team: ["u5", "u3", "u2"] },
  { id: "p7", name: "Restructuracion Societaria", clientId: "c2", clientName: "Tecnologias Avanzadas", category: "Societario", status: "En Espera", priority: "Media", assignedTo: ["u5"], dueDate: "2026-05-15", description: "Restructuracion de la sociedad y modificacion de estatutos sociales.", avance: "Proyecto en espera. Se realizara una vez concluida la fusion corporativa. Sin avance por el momento.", startDate: "2026-04-01", progress: 0, budget: 60000, team: ["u5"] },
  { id: "p8", name: "Contrato Licencia de Marca", clientId: "c6", clientName: "Farmaceutica Nacional", category: "Contractual", status: "Activo", priority: "Baja", assignedTo: ["u4"], dueDate: "2026-06-01", description: "Elaboracion de contrato de licencia de uso de marca para mercados internacionales.", avance: "Investigacion de regulaciones de propiedad intelectual en mercados objetivo. Se inicio la redaccion del contrato de licencia.", startDate: "2026-01-25", progress: 15, budget: 35000, team: ["u4", "u1"] },
  { id: "p9", name: "Defensa Credito Fiscal ISR", clientId: "c1", clientName: "Grupo Industrial del Norte", category: "Litigio Fiscal", status: "Activo", priority: "Critica", assignedTo: ["u3"], dueDate: "2026-02-17", juzgado: "TFJA - Sala Superior", expediente: "LF-0789/2025", description: "Defensa ante determinacion de credito fiscal por ISR del ejercicio 2023.", avance: "Recurso ante Sala Superior en preparacion final. Se presentaron argumentos de fondo y pruebas supervenientes. Fecha limite proxima.", startDate: "2025-10-01", progress: 90, budget: 220000, team: ["u3", "u4", "u2", "u1"] },
  { id: "p10", name: "Procedimiento PRODECON", clientId: "c5", clientName: "Distribuidora Mexicana", category: "Procedimientos Administrativos", status: "Activo", priority: "Media", assignedTo: ["u4", "u5"], dueDate: "2026-04-10", description: "Acuerdo conclusivo ante PRODECON por diferencias en deducciones fiscales.", avance: "Solicitud de acuerdo conclusivo en preparacion. Recopilando documentacion soporte de deducciones cuestionadas por la autoridad.", startDate: "2026-02-01", progress: 10, budget: 40000, team: ["u4", "u5"] },
]

// Demo Tasks
export const tasks: Task[] = [
  { id: "t1", title: "Preparar escrito recurso de revocacion", projectId: "p1", projectName: "Recurso de Revocacion SAT 2025", assignedTo: "u3", assignedToName: "Abogado", priority: "Critica", status: "En Progreso", dueDate: "2026-02-15", description: "Compilar argumentos y redactar recurso de revocacion.", hoursLogged: 12, alerts: [{ date: "2026-02-10", time: "09:00" }, { date: "2026-02-13", time: "09:00" }, { date: "2026-02-15", time: "08:00" }], avance: "Borrador inicial al 80%. Pendiente validar jurisprudencia reciente.", progressUpdates: [{ id: "1", date: "2024-02-10", content: "Revision inicial del expediente realizada.", author: "Lic. Arturo" }] },
  { id: "t2", title: "Integrar expediente pruebas", projectId: "p1", projectName: "Recurso de Revocacion SAT 2025", assignedTo: "u4", assignedToName: "Lic. Maria Lopez", priority: "Alta", status: "Pendiente", dueDate: "2026-02-18", description: "Integrar todas las pruebas documentales del expediente.", hoursLogged: 4, alerts: [{ date: "2026-02-13", time: "09:00" }, { date: "2026-02-16", time: "09:00" }, { date: "2026-02-18", time: "08:00" }], avance: "Recopilación de pruebas iniciada. Faltan documentos del area contable.", progressUpdates: [] },
  { id: "t3", title: "Due Diligence legal y financiero", projectId: "p2", projectName: "Fusion Corporativa TecAv-SoftMex", assignedTo: "u3", assignedToName: "Abogado", priority: "Critica", status: "En Progreso", dueDate: "2026-02-22", description: "Analisis legal y financiero completo de ambas sociedades.", hoursLogged: 24, alerts: [{ date: "2026-02-17", time: "09:00" }, { date: "2026-02-20", time: "09:00" }, { date: "2026-02-22", time: "08:00" }], avance: "Revision de actas de asamblea completa. En espera de estados financieros auditados.", progressUpdates: [] },
  { id: "t4", title: "Redactar acta de fusion", projectId: "p2", projectName: "Fusion Corporativa TecAv-SoftMex", assignedTo: "u5", assignedToName: "Fernando Reyes", priority: "Critica", status: "Pendiente", dueDate: "2026-03-01", description: "Elaboracion del acta constitutiva de la fusion.", hoursLogged: 0, alerts: [{ date: "2026-02-24", time: "09:00" }, { date: "2026-02-27", time: "10:00" }], avance: "", progressUpdates: [] },
  { id: "t5", title: "Presentar demanda de nulidad", projectId: "p3", projectName: "Juicio Nulidad Multa Ambiental", assignedTo: "u4", assignedToName: "Maria Lopez", priority: "Alta", status: "Vencida", dueDate: "2026-02-10", description: "Redaccion y presentacion de demanda de nulidad ante TFJA.", hoursLogged: 8, alerts: [{ date: "2026-02-05", time: "09:00" }, { date: "2026-02-08", time: "09:00" }, { date: "2026-02-10", time: "08:00" }], avance: "", progressUpdates: [] },
  { id: "t6", title: "Recopilar pruebas periciales", projectId: "p3", projectName: "Juicio Nulidad Multa Ambiental", assignedTo: "u4", assignedToName: "Maria Lopez", priority: "Alta", status: "En Progreso", dueDate: "2026-02-25", description: "Recopilar dictamenes periciales y evidencia documental.", hoursLogged: 6, alerts: [{ date: "2026-02-20", time: "09:00" }, { date: "2026-02-23", time: "10:00" }], avance: "", progressUpdates: [] },
  { id: "t7", title: "Informe de planeacion fiscal", projectId: "p4", projectName: "Consultoria Planeacion Fiscal", assignedTo: "u5", assignedToName: "Fernando Reyes", priority: "Media", status: "Completada", dueDate: "2026-02-28", description: "Elaborar informe final de planeacion fiscal 2026.", hoursLogged: 10, alerts: [{ date: "2026-02-23", time: "09:00" }], avance: "", progressUpdates: [] },
  { id: "t8", title: "Revision clausulas contractuales", projectId: "p5", projectName: "Contrato Distribucion Nacional", assignedTo: "u3", assignedToName: "Arturo Flores", priority: "Alta", status: "Pendiente", dueDate: "2026-02-20", description: "Revisar y negociar clausulas clave del contrato marco.", hoursLogged: 3, alerts: [{ date: "2026-02-15", time: "09:00" }, { date: "2026-02-18", time: "09:00" }, { date: "2026-02-20", time: "08:00" }], avance: "", progressUpdates: [] },
  { id: "t9", title: "Recurso ante Sala Superior", projectId: "p9", projectName: "Defensa Credito Fiscal ISR", assignedTo: "u3", assignedToName: "Arturo Flores", priority: "Critica", status: "En Progreso", dueDate: "2026-02-17", description: "Presentar recurso ante la Sala Superior del TFJA.", hoursLogged: 18, alerts: [{ date: "2026-02-12", time: "09:00" }, { date: "2026-02-15", time: "09:00" }, { date: "2026-02-17", time: "08:00" }], avance: "", progressUpdates: [] },
  { id: "t10", title: "Audiencia preliminar TFJA", projectId: "p3", projectName: "Juicio Nulidad Multa Ambiental", assignedTo: "u4", assignedToName: "Maria Lopez", priority: "Alta", status: "Pendiente", dueDate: "2026-03-05", description: "Preparar y asistir a audiencia en TFJA.", hoursLogged: 2, alerts: [{ date: "2026-02-28", time: "09:00" }, { date: "2026-03-03", time: "09:00" }, { date: "2026-03-05", time: "07:00" }], avance: "", progressUpdates: [] },
  { id: "t11", title: "Preparar documentacion materialidad", projectId: "p6", projectName: "Revision Materialidad Operaciones", assignedTo: "u5", assignedToName: "Fernando Reyes", priority: "Alta", status: "Pendiente", dueDate: "2026-02-28", description: "Integrar documentacion para acreditar materialidad ante el SAT.", hoursLogged: 0, alerts: [{ date: "2026-02-23", time: "09:00" }, { date: "2026-02-26", time: "10:00" }], avance: "", progressUpdates: [] },
  { id: "t12", title: "Capacitacion personal", projectId: "p7", projectName: "Implementacion Compliance Penal", assignedTo: "u4", assignedToName: "Maria Lopez", priority: "Baja", status: "En Progreso", dueDate: "2026-03-10", description: "Impartir curso de capacitacion sobre prevencion de lavado de dinero.", hoursLogged: 5, alerts: [], avance: "", progressUpdates: [] },
  { id: "t13", title: "Registro marca", projectId: "p8", projectName: "Registro Marca Internacional", assignedTo: "u5", assignedToName: "Fernando Reyes", priority: "Media", status: "Pendiente", dueDate: "2026-03-15", description: "Presentar solicitud de registro de marca ante el IMPI.", hoursLogged: 1, alerts: [], avance: "", progressUpdates: [] },
  { id: "t14", title: "Contestacion requerimiento", projectId: "p3", projectName: "Juicio Nulidad Multa Ambiental", assignedTo: "u3", assignedToName: "Arturo Flores", priority: "Alta", status: "En Progreso", dueDate: "2026-02-20", description: "Contestar requerimiento de informacion de la autoridad ambiental.", hoursLogged: 4, alerts: [{ date: "2026-02-18", time: "09:00" }], avance: "", progressUpdates: [] },
]

// Demo Time Entries
export const timeEntries: TimeEntry[] = [
  { id: "te1", taskId: "t1", taskTitle: "Preparar escrito recurso de revocacion", projectName: "Recurso de Revocacion SAT 2025", userId: "u3", userName: "Arturo Flores", date: "2026-02-12", hours: 4, billable: true, description: "Compilacion de argumentos legales." },
  { id: "te2", taskId: "t1", taskTitle: "Preparar escrito recurso de revocacion", projectName: "Recurso de Revocacion SAT 2025", userId: "u3", userName: "Arturo Flores", date: "2026-02-11", hours: 3.5, billable: true, description: "Revision de jurisprudencia aplicable." },
  { id: "te3", taskId: "t3", taskTitle: "Due Diligence legal y financiero", projectName: "Fusion Corporativa TecAv-SoftMex", userId: "u3", userName: "Arturo Flores", date: "2026-02-12", hours: 6, billable: true, description: "Analisis de estados financieros y contratos." },
  { id: "te4", taskId: "t5", taskTitle: "Presentar demanda de nulidad", projectName: "Juicio Nulidad Multa Ambiental", userId: "u4", userName: "Maria Lopez", date: "2026-02-10", hours: 5, billable: true, description: "Redaccion de demanda de nulidad." },
  { id: "te5", taskId: "t6", taskTitle: "Recopilar pruebas periciales", projectName: "Juicio Nulidad Multa Ambiental", userId: "u4", userName: "Maria Lopez", date: "2026-02-12", hours: 3, billable: true, description: "Organizacion de pruebas periciales." },
  { id: "te6", taskId: "t9", taskTitle: "Recurso ante Sala Superior", projectName: "Defensa Credito Fiscal ISR", userId: "u3", userName: "Arturo Flores", date: "2026-02-13", hours: 5, billable: true, description: "Preparacion de recurso legal." },
  { id: "te7", taskId: "t7", taskTitle: "Informe de planeacion fiscal", projectName: "Consultoria Planeacion Fiscal", userId: "u5", userName: "Fernando Reyes", date: "2026-02-11", hours: 4, billable: true, description: "Redaccion del informe de planeacion." },
  { id: "te8", taskId: "t8", taskTitle: "Revision clausulas contractuales", projectName: "Contrato Distribucion Nacional", userId: "u3", userName: "Arturo Flores", date: "2026-02-10", hours: 2, billable: false, description: "Reunion interna de revision." },
  { id: "te9", taskId: "t12", taskTitle: "Redactar contrato de licencia", projectName: "Contrato Licencia de Marca", userId: "u4", userName: "Maria Lopez", date: "2026-02-13", hours: 2.5, billable: true, description: "Preparacion de documentos de licencia." },
  { id: "te10", taskId: "t4", taskTitle: "Redactar acta de fusion", projectName: "Fusion Corporativa TecAv-SoftMex", userId: "u5", userName: "Fernando Reyes", date: "2026-02-12", hours: 3, billable: true, description: "Investigacion de actas similares." },
  { id: "te11", taskId: "t14", taskTitle: "Analisis operaciones con proveedores", projectName: "Revision Materialidad Operaciones", userId: "u3", userName: "Arturo Flores", date: "2026-02-13", hours: 3.5, billable: true, description: "Revision de CFDIs y contratos." },
  { id: "te12", taskId: "t11", taskTitle: "Preparar documentacion materialidad", projectName: "Revision Materialidad Operaciones", userId: "u5", userName: "Fernando Reyes", date: "2026-02-13", hours: 2, billable: true, description: "Integracion de expediente." },
]

// Demo Notifications
export const notifications: Notification[] = [
  { id: "n1", type: "vencimiento", title: "Tarea Vencida", message: "Demanda de nulidad - Juicio Multa Ambiental ha vencido.", date: "2026-02-10", read: false, targetRole: "admin", linkTo: "tareas" },
  { id: "n2", type: "vencimiento", title: "Vence en 2 dias", message: "Recurso de revocacion SAT - Grupo Industrial vence el 15 Feb.", date: "2026-02-13", read: false, linkTo: "proyectos" },
  { id: "n3", type: "vencimiento", title: "Vence en 4 dias", message: "Recurso Sala Superior - Defensa Credito Fiscal vence el 17 Feb.", date: "2026-02-13", read: false, linkTo: "proyectos" },
  { id: "n4", type: "asignacion", title: "Nueva Tarea Asignada", message: "Se te ha asignado: Revision clausulas contractuales.", date: "2026-02-12", read: true, targetRole: "abogado", linkTo: "tareas" },
  { id: "n5", type: "recordatorio", title: "Recordatorio Semanal", message: "Tienes 7 tareas pendientes esta semana.", date: "2026-02-10", read: true, targetRole: "abogado", linkTo: "dashboard" },
  { id: "n6", type: "recordatorio", title: "Documentación Entregada", message: "Farmaceutica Nacional ha entregado los contratos firmados del proyecto #P-2024-001.", date: "2026-02-14", read: false, targetRole: "admin", linkTo: "documentos" },
  { id: "n7", type: "asignacion", title: "Revision de Horas", message: "Favor de revisar las horas registradas por el equipo esta semana.", date: "2026-02-14", read: false, targetRole: "admin", linkTo: "tiempos" },
]

// Stats for dashboard
export const dashboardStats = {
  totalProjects: 10,
  activeProjects: 8,
  totalTasks: 14,
  pendingTasks: 7,
  overdueTasks: 1,
  criticalTasks: 4,
  totalClients: 6,
  hoursThisWeek: 46.5,
  billableHours: 44.5,
}

// Chart data - by subcategory
export const categoryDistribution = [
  { name: "Litigio Fiscal", value: 2, fill: "#ef4444" },
  { name: "Consultoria Fiscal", value: 1, fill: "#0ea5e9" },
  { name: "Proc. Administrativos", value: 2, fill: "#f59e0b" },
  { name: "Materialidad", value: 1, fill: "#8b5cf6" },
  { name: "Societario", value: 2, fill: "#10b981" },
  { name: "Contractual", value: 2, fill: "#14b8a6" },
]

// Division distribution for donut
export const divisionDistribution = [
  { name: "Fiscal", value: 6, fill: "#1a2744" },
  { name: "Corporativo", value: 4, fill: "#c5913a" },
]

export const weeklyHoursData = [
  { day: "Lun", Arturo: 6, Maria: 5, Fernando: 4 },
  { day: "Mar", Arturo: 7.5, Maria: 5, Fernando: 7 },
  { day: "Mie", Arturo: 10, Maria: 8, Fernando: 3 },
  { day: "Jue", Arturo: 15, Maria: 10.5, Fernando: 7 },
  { day: "Vie", Arturo: 5, Maria: 2.5, Fernando: 2 },
]

export const tasksByStatusData = [
  { name: "Pendientes", value: 7, fill: "#64748b" },
  { name: "En Progreso", value: 5, fill: "#0ea5e9" },
  { name: "Completadas", value: 1, fill: "#10b981" },
  { name: "Vencidas", value: 1, fill: "#ef4444" },
]


