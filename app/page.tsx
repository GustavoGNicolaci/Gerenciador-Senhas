"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Shield,
  Plus,
  Eye,
  EyeOff,
  Copy,
  Trash2,
  Edit,
  Key,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Lock,
  Languages,
  Moon,
  Sun,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import "./password-manager.css"

interface Password {
  id: string
  title: string
  username: string
  password: string
  website: string
  category: string
  notes: string
  createdAt: Date
  updatedAt: Date
}

interface Translations {
  [key: string]: {
    [key: string]: string
  }
}

const translations: Translations = {
  pt: {
    // Auth
    passwordManager: "Gerenciador de Senhas",
    masterPasswordDesc: "Digite sua senha mestra para acessar suas credenciais",
    masterPassword: "Senha Mestra",
    enterMasterPassword: "Digite sua senha mestra",
    access: "Acessar",
    logout: "Sair",

    // Main interface
    secureCredentials: "Suas credenciais seguras e organizadas",
    myPasswords: "Minhas Senhas",
    security: "Segurança",
    searchPasswords: "Buscar senhas...",
    allCategories: "Todas as categorias",
    newPassword: "Nova Senha",

    // Categories
    personal: "Pessoal",
    work: "Trabalho",
    financial: "Financeiro",
    social: "Social",
    others: "Outros",

    // Form
    editPassword: "Editar Senha",
    title: "Título",
    titleRequired: "Título *",
    titlePlaceholder: "Ex: Gmail, Netflix...",
    userEmail: "Usuário/Email",
    userPlaceholder: "usuario@email.com",
    passwordRequired: "Senha *",
    passwordPlaceholder: "Digite a senha",
    website: "Website",
    websitePlaceholder: "https://exemplo.com",
    category: "Categoria",
    notes: "Notas",
    notesPlaceholder: "Informações adicionais...",
    save: "Salvar",
    update: "Atualizar",
    cancel: "Cancelar",

    // Password strength
    veryWeak: "Muito fraca",
    weak: "Fraca",
    medium: "Média",
    strong: "Forte",

    // Messages
    accessGranted: "Acesso liberado",
    welcomeMessage: "Bem-vindo ao seu gerenciador de senhas!",
    invalidPassword: "Senha inválida",
    passwordMinLength: "A senha deve ter pelo menos 6 caracteres.",
    requiredFields: "Campos obrigatórios",
    titlePasswordRequired: "Título e senha são obrigatórios.",
    passwordUpdated: "Senha atualizada",
    infoSaved: "As informações foram salvas com sucesso.",
    passwordAdded: "Senha adicionada",
    newCredentialSaved: "Nova credencial salva com segurança.",
    passwordRemoved: "Senha removida",
    credentialDeleted: "A credencial foi excluída permanentemente.",
    copied: "Copiado!",
    copiedToClipboard: "copiado para a área de transferência.",

    // Empty state
    noPasswordsFound: "Nenhuma senha encontrada",
    startAdding: "Comece adicionando sua primeira credencial",
    adjustFilters: "Tente ajustar os filtros de busca",
    addFirstPassword: "Adicionar Primeira Senha",

    // Security tab
    securityStats: "Estatísticas de Segurança",
    totalPasswords: "Total de senhas:",
    weakPasswords: "Senhas fracas:",
    strongPasswords: "Senhas fortes:",
    passwordGenerator: "Gerador de Senhas",
    generateSecurePasswords: "Gere senhas seguras para suas contas",
    generateNewPassword: "Gerar Nova Senha",
    minChars: "• Mínimo 16 caracteres",
    includesAll: "• Inclui maiúsculas, minúsculas, números e símbolos",
    randomGenerated: "• Gerada aleatoriamente para máxima segurança",

    // Delete confirmation
    confirmDelete: "Confirmar exclusão",
    deleteConfirmation: "Tem certeza que deseja excluir a senha",
    actionUndoable: "Esta ação não pode ser desfeita.",
    delete: "Excluir",

    setupMasterPassword: "Configurar Senha Mestra",
    setupMasterPasswordDesc: "Crie uma senha mestra para proteger suas credenciais",
    createMasterPassword: "Criar Senha Mestra",
    confirmMasterPassword: "Confirmar Senha Mestra",
    passwordsDoNotMatch: "As senhas não coincidem",
    masterPasswordCreated: "Senha mestra criada",
    setupComplete: "Configuração concluída com sucesso!",
    darkTheme: "Tema Escuro",
    lightTheme: "Tema Claro",
    changeMasterPassword: "Alterar Senha Mestra",
    changeMasterPasswordDesc: "Digite sua senha mestra atual e a nova senha para alterar.",
    currentMasterPassword: "Senha Mestra Atual",
    newMasterPassword: "Nova Senha Mestra",
    confirmNewMasterPassword: "Confirmar Nova Senha Mestra",
    enterCurrentPassword: "Digite sua senha mestra atual",
    enterNewPassword: "Digite a nova senha mestra",
    confirmNewPassword: "Confirme a nova senha mestra",
  },
  en: {
    // Auth
    passwordManager: "Password Manager",
    masterPasswordDesc: "Enter your master password to access your credentials",
    masterPassword: "Master Password",
    enterMasterPassword: "Enter your master password",
    access: "Access",
    logout: "Logout",

    // Main interface
    secureCredentials: "Your secure and organized credentials",
    myPasswords: "My Passwords",
    security: "Security",
    searchPasswords: "Search passwords...",
    allCategories: "All categories",
    newPassword: "New Password",

    // Categories
    personal: "Personal",
    work: "Work",
    financial: "Financial",
    social: "Social",
    others: "Others",

    // Form
    editPassword: "Edit Password",
    title: "Title",
    titleRequired: "Title *",
    titlePlaceholder: "Ex: Gmail, Netflix...",
    userEmail: "User/Email",
    userPlaceholder: "user@email.com",
    passwordRequired: "Password *",
    passwordPlaceholder: "Enter password",
    website: "Website",
    websitePlaceholder: "https://example.com",
    category: "Category",
    notes: "Notes",
    notesPlaceholder: "Additional information...",
    save: "Save",
    update: "Update",
    cancel: "Cancel",

    // Password strength
    veryWeak: "Very weak",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",

    // Messages
    accessGranted: "Access granted",
    welcomeMessage: "Welcome to your password manager!",
    invalidPassword: "Invalid password",
    passwordMinLength: "Password must be at least 6 characters.",
    requiredFields: "Required fields",
    titlePasswordRequired: "Title and password are required.",
    passwordUpdated: "Password updated",
    infoSaved: "Information saved successfully.",
    passwordAdded: "Password added",
    newCredentialSaved: "New credential saved securely.",
    passwordRemoved: "Password removed",
    credentialDeleted: "Credential permanently deleted.",
    copied: "Copied!",
    copiedToClipboard: "copied to clipboard.",

    // Empty state
    noPasswordsFound: "No passwords found",
    startAdding: "Start by adding your first credential",
    adjustFilters: "Try adjusting the search filters",
    addFirstPassword: "Add First Password",

    // Security tab
    securityStats: "Security Statistics",
    totalPasswords: "Total passwords:",
    weakPasswords: "Weak passwords:",
    strongPasswords: "Strong passwords:",
    passwordGenerator: "Password Generator",
    generateSecurePasswords: "Generate secure passwords for your accounts",
    generateNewPassword: "Generate New Password",
    minChars: "• Minimum 16 characters",
    includesAll: "• Includes uppercase, lowercase, numbers and symbols",
    randomGenerated: "• Randomly generated for maximum security",

    // Delete confirmation
    confirmDelete: "Confirm deletion",
    deleteConfirmation: "Are you sure you want to delete the password",
    actionUndoable: "This action cannot be undone.",
    delete: "Delete",

    setupMasterPassword: "Setup Master Password",
    setupMasterPasswordDesc: "Create a master password to protect your credentials",
    createMasterPassword: "Create Master Password",
    confirmMasterPassword: "Confirm Master Password",
    passwordsDoNotMatch: "Passwords do not match",
    masterPasswordCreated: "Master password created",
    setupComplete: "Setup completed successfully!",
    darkTheme: "Dark Theme",
    lightTheme: "Light Theme",
    changeMasterPassword: "Change Master Password",
    changeMasterPasswordDesc: "Enter your current master password and the new password to change.",
    currentMasterPassword: "Current Master Password",
    newMasterPassword: "New Master Password",
    confirmNewMasterPassword: "Confirm New Master Password",
    enterCurrentPassword: "Enter your current master password",
    enterNewPassword: "Enter the new master password",
    confirmNewPassword: "Confirm the new master password",
  },
}

const getCategoriesForLanguage = (lang: string) => [
  translations[lang].allCategories,
  translations[lang].personal,
  translations[lang].work,
  translations[lang].financial,
  translations[lang].social,
  translations[lang].others,
]

// Função para criptografar dados (simulação - em produção use crypto real)
const encrypt = (text: string): string => {
  return btoa(text) // Base64 para demonstração
}

// Função para descriptografar dados
const decrypt = (encryptedText: string): string => {
  try {
    return atob(encryptedText)
  } catch {
    return encryptedText
  }
}

const getPasswordStrength = (password: string, t: any): { score: number; feedback: string; color: string } => {
  let score = 0

  if (password.length >= 8) score += 25
  if (password.length >= 12) score += 15
  if (/[a-z]/.test(password)) score += 15
  if (/[A-Z]/.test(password)) score += 15
  if (/[0-9]/.test(password)) score += 15
  if (/[^A-Za-z0-9]/.test(password)) score += 15

  if (score < 40) {
    return { score, feedback: t.veryWeak, color: "bg-destructive" }
  } else if (score < 60) {
    return { score, feedback: t.weak, color: "bg-yellow-500" }
  } else if (score < 80) {
    return { score, feedback: t.medium, color: "bg-blue-500" }
  } else {
    return { score, feedback: t.strong, color: "bg-blue-600" }
  }
}

// Função para gerar senha segura
const generateSecurePassword = (length = 16): string => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz"
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
  const numbers = "0123456789"
  const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?"

  const allChars = lowercase + uppercase + numbers + symbols
  let password = ""

  // Garantir pelo menos um de cada tipo
  password += lowercase[Math.floor(Math.random() * lowercase.length)]
  password += uppercase[Math.floor(Math.random() * uppercase.length)]
  password += numbers[Math.floor(Math.random() * numbers.length)]
  password += symbols[Math.floor(Math.random() * symbols.length)]

  // Preencher o resto
  for (let i = 4; i < length; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)]
  }

  // Embaralhar
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("")
}

export default function PasswordManager() {
  const [language, setLanguage] = useState("pt")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMasterPasswordSet, setIsMasterPasswordSet] = useState(false)
  const [setupPassword, setSetupPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const t = translations[language]
  const categories = getCategoriesForLanguage(language)

  const [passwords, setPasswords] = useState<Password[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingPassword, setEditingPassword] = useState<Password | null>(null)
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set())
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState(t.allCategories)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [masterPassword, setMasterPassword] = useState("")
  const [isResetDialogOpen, setIsResetDialogOpen] = useState(false)
  const [oldMasterPassword, setOldMasterPassword] = useState("")
  const [newMasterPassword, setNewMasterPassword] = useState("")
  const [confirmNewMasterPassword, setConfirmNewMasterPassword] = useState("")
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    title: "",
    username: "",
    password: "",
    website: "",
    category: t.personal,
    notes: "",
  })

  const toggleLanguage = () => {
    const newLang = language === "pt" ? "en" : "pt"
    setLanguage(newLang)
    setSelectedCategory(translations[newLang].allCategories)
    setFormData((prev) => ({ ...prev, category: translations[newLang].personal }))
  }

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    localStorage.setItem("darkMode", (!isDarkMode).toString())
  }

  useEffect(() => {
    const savedMasterPassword = localStorage.getItem("master_password_hash")
    const savedTheme = localStorage.getItem("darkMode")

    setIsMasterPasswordSet(!!savedMasterPassword)
    setIsDarkMode(savedTheme === "true")
  }, [])

  // Carregar dados do localStorage na inicialização
  useEffect(() => {
    const savedPasswords = localStorage.getItem("encrypted_passwords")
    if (savedPasswords && isAuthenticated) {
      try {
        const decryptedData = decrypt(savedPasswords)
        setPasswords(JSON.parse(decryptedData))
      } catch (error) {
        console.error("Erro ao carregar senhas:", error)
      }
    }
  }, [isAuthenticated])

  // Salvar dados no localStorage
  const saveToStorage = (passwordList: Password[]) => {
    const encryptedData = encrypt(JSON.stringify(passwordList))
    localStorage.setItem("encrypted_passwords", encryptedData)
  }

  const handleSetupMasterPassword = () => {
    if (setupPassword.length < 6) {
      toast({
        title: t.invalidPassword,
        description: t.passwordMinLength,
        variant: "destructive",
      })
      return
    }

    if (setupPassword !== confirmPassword) {
      toast({
        title: t.passwordsDoNotMatch,
        description: t.passwordsDoNotMatch,
        variant: "destructive",
      })
      return
    }

    // Simple hash simulation - in production use proper hashing
    const passwordHash = btoa(setupPassword)
    localStorage.setItem("master_password_hash", passwordHash)
    setIsMasterPasswordSet(true)

    toast({
      title: t.masterPasswordCreated,
      description: t.setupComplete,
    })
  }

  const handleResetMasterPassword = () => {
    const storedHash = localStorage.getItem("master_password_hash")
    const oldPasswordHash = btoa(oldMasterPassword)

    if (oldPasswordHash !== storedHash) {
      toast({
        title: t.invalidPassword,
        description: language === "pt" ? "Senha mestra atual incorreta." : "Current master password is incorrect.",
        variant: "destructive",
      })
      return
    }

    if (newMasterPassword.length < 6) {
      toast({
        title: t.invalidPassword,
        description: t.passwordMinLength,
        variant: "destructive",
      })
      return
    }

    if (newMasterPassword !== confirmNewMasterPassword) {
      toast({
        title: t.passwordsDoNotMatch,
        description: t.passwordsDoNotMatch,
        variant: "destructive",
      })
      return
    }

    // Update master password hash
    const newPasswordHash = btoa(newMasterPassword)
    localStorage.setItem("master_password_hash", newPasswordHash)

    // Clear form and close dialog
    setOldMasterPassword("")
    setNewMasterPassword("")
    setConfirmNewMasterPassword("")
    setIsResetDialogOpen(false)

    toast({
      title: language === "pt" ? "Senha mestra alterada" : "Master password changed",
      description:
        language === "pt"
          ? "Sua senha mestra foi alterada com sucesso!"
          : "Your master password has been changed successfully!",
    })
  }

  const handleAuthentication = () => {
    const storedHash = localStorage.getItem("master_password_hash")
    const inputHash = btoa(masterPassword)

    if (masterPassword.length >= 6 && inputHash === storedHash) {
      setIsAuthenticated(true)
      toast({
        title: t.accessGranted,
        description: t.welcomeMessage,
      })
    } else {
      toast({
        title: t.invalidPassword,
        description: t.passwordMinLength,
        variant: "destructive",
      })
    }
  }

  // Adicionar ou editar senha
  const handleSavePassword = () => {
    if (!formData.title || !formData.password) {
      toast({
        title: t.requiredFields,
        description: t.titlePasswordRequired,
        variant: "destructive",
      })
      return
    }

    const now = new Date()
    let updatedPasswords: Password[]

    if (editingPassword) {
      updatedPasswords = passwords.map((p) =>
        p.id === editingPassword.id ? { ...formData, id: p.id, createdAt: p.createdAt, updatedAt: now } : p,
      )
      toast({
        title: t.passwordUpdated,
        description: t.infoSaved,
      })
    } else {
      const newPassword: Password = {
        ...formData,
        id: Date.now().toString(),
        createdAt: now,
        updatedAt: now,
      }
      updatedPasswords = [...passwords, newPassword]
      toast({
        title: t.passwordAdded,
        description: t.newCredentialSaved,
      })
    }

    setPasswords(updatedPasswords)
    saveToStorage(updatedPasswords)
    resetForm()
  }

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      title: "",
      username: "",
      password: "",
      website: "",
      category: t.personal,
      notes: "",
    })
    setEditingPassword(null)
    setIsDialogOpen(false)
  }

  // Deletar senha
  const handleDeletePassword = (id: string) => {
    const updatedPasswords = passwords.filter((p) => p.id !== id)
    setPasswords(updatedPasswords)
    saveToStorage(updatedPasswords)
    toast({
      title: t.passwordRemoved,
      description: t.credentialDeleted,
    })
  }

  // Copiar para clipboard
  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: t.copied,
      description: `${type} ${t.copiedToClipboard}`,
    })
  }

  // Toggle visibilidade da senha
  const togglePasswordVisibility = (id: string) => {
    const newVisible = new Set(visiblePasswords)
    if (newVisible.has(id)) {
      newVisible.delete(id)
    } else {
      newVisible.add(id)
    }
    setVisiblePasswords(newVisible)
  }

  // Filtrar senhas
  const filteredPasswords = passwords.filter((password) => {
    const matchesSearch =
      password.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      password.website.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === t.allCategories || password.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Estatísticas de segurança
  const securityStats = {
    total: passwords.length,
    weak: passwords.filter((p) => getPasswordStrength(p.password, t).score < 60).length,
    strong: passwords.filter((p) => getPasswordStrength(p.password, t).score >= 80).length,
  }

  if (!isMasterPasswordSet) {
    return (
      <div
        className={`password-manager-container ${isDarkMode ? "password-manager-dark" : "password-manager-light"} flex items-center justify-center p-4`}
      >
        <Card className="auth-card w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center mb-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="theme-toggle">
                {isDarkMode ? <Sun className="w-4 h-4 mr-1" /> : <Moon className="w-4 h-4 mr-1" />}
                {isDarkMode ? t.lightTheme : t.darkTheme}
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleLanguage} className="language-toggle">
                <Languages className="w-4 h-4 mr-1" />
                {language === "pt" ? "EN" : "PT"}
              </Button>
            </div>
            <div className="shield-container mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center">
              <Shield className="shield-icon w-8 h-8" />
            </div>
            <CardTitle className="auth-card-title text-2xl">{t.setupMasterPassword}</CardTitle>
            <CardDescription className="auth-card-description">{t.setupMasterPasswordDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="setup-password" className="pm-label">
                {t.createMasterPassword}
              </Label>
              <Input
                id="setup-password"
                type="password"
                placeholder={t.enterMasterPassword}
                value={setupPassword}
                onChange={(e) => setSetupPassword(e.target.value)}
                className="pm-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="pm-label">
                {t.confirmMasterPassword}
              </Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder={t.confirmMasterPassword}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSetupMasterPassword()}
                className="pm-input"
              />
            </div>
            <Button onClick={handleSetupMasterPassword} className="pm-button-primary w-full">
              <Lock className="w-4 h-4 mr-2" />
              {t.createMasterPassword}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div
        className={`password-manager-container ${isDarkMode ? "password-manager-dark" : "password-manager-light"} flex items-center justify-center p-4`}
      >
        <Card className="auth-card w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-between items-center mb-2">
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="theme-toggle">
                {isDarkMode ? <Sun className="w-4 h-4 mr-1" /> : <Moon className="w-4 h-4 mr-1" />}
                {isDarkMode ? t.lightTheme : t.darkTheme}
              </Button>
              <Button variant="ghost" size="sm" onClick={toggleLanguage} className="language-toggle">
                <Languages className="w-4 h-4 mr-1" />
                {language === "pt" ? "EN" : "PT"}
              </Button>
            </div>
            <div className="shield-container mx-auto mb-4 w-16 h-16 rounded-full flex items-center justify-center">
              <Shield className="shield-icon w-8 h-8" />
            </div>
            <CardTitle className="auth-card-title text-2xl">{t.passwordManager}</CardTitle>
            <CardDescription className="auth-card-description">{t.masterPasswordDesc}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="master-password" className="pm-label">
                {t.masterPassword}
              </Label>
              <Input
                id="master-password"
                type="password"
                placeholder={t.enterMasterPassword}
                value={masterPassword}
                onChange={(e) => setMasterPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAuthentication()}
                className="pm-input"
              />
            </div>
            <Button onClick={handleAuthentication} className="pm-button-primary w-full">
              <Lock className="w-4 h-4 mr-2" />
              {t.access}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`password-manager-container ${isDarkMode ? "password-manager-dark" : "password-manager-light"}`}>
      <div className="container mx-auto p-4 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="shield-container w-10 h-10 rounded-lg flex items-center justify-center">
              <Shield className="shield-icon w-6 h-6" />
            </div>
            <div>
              <h1 className="pm-text-primary text-2xl font-bold">{t.passwordManager}</h1>
              <p className="pm-text-secondary text-sm">{t.secureCredentials}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={toggleTheme} className="theme-toggle bg-transparent">
              {isDarkMode ? <Sun className="w-4 h-4 mr-1" /> : <Moon className="w-4 h-4 mr-1" />}
              {isDarkMode ? t.lightTheme : t.darkTheme}
            </Button>
            <Button variant="outline" size="sm" onClick={toggleLanguage} className="language-toggle bg-transparent">
              <Languages className="w-4 h-4 mr-1" />
              {language === "pt" ? "EN" : "PT"}
            </Button>
            <Button onClick={() => setIsAuthenticated(false)} variant="outline" size="sm" className="logout-button">
              {t.logout}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="passwords" className="w-full">
          <TabsList className="pm-tabs-list grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="passwords" className="pm-tab-trigger transition-all duration-200">
              <Key className="w-4 h-4 mr-2" />
              {t.myPasswords}
            </TabsTrigger>
            <TabsTrigger value="security" className="pm-tab-trigger transition-all duration-200">
              <Shield className="w-4 h-4 mr-2" />
              {t.security}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="passwords" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                placeholder={t.searchPasswords}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pm-input flex-1"
              />
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="pm-input w-full sm:w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent
                  className={`pm-select-content ${isDarkMode ? "password-manager-dark" : "password-manager-light"}`}
                >
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="pm-select-item">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    onClick={() => {
                      resetForm()
                      setIsDialogOpen(true)
                    }}
                    className="pm-button-primary"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t.newPassword}
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className={`pm-dialog-content max-w-md ${isDarkMode ? "password-manager-dark" : "password-manager-light"}`}
                >
                  <DialogHeader>
                    <DialogTitle className="pm-text-primary">
                      {editingPassword ? t.editPassword : t.newPassword}
                    </DialogTitle>
                    <DialogDescription className="pm-text-secondary">
                      Preencha as informações da credencial
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="pm-label">
                        {t.titleRequired}
                      </Label>
                      <Input
                        id="title"
                        placeholder={t.titlePlaceholder}
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="pm-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="username" className="pm-label">
                        {t.userEmail}
                      </Label>
                      <Input
                        id="username"
                        placeholder={t.userPlaceholder}
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="pm-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password" className="pm-label">
                        {t.passwordRequired}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          id="password"
                          type="password"
                          placeholder={t.passwordPlaceholder}
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          className="pm-input flex-1"
                        />
                        {/* Corrigindo função do botão gerador de senha no formulário */}
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={() => setFormData({ ...formData, password: generateSecurePassword() })}
                          className="theme-toggle"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                      {formData.password && (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Progress
                              value={getPasswordStrength(formData.password, t).score}
                              className="flex-1 h-2 password-manager-dark"
                            />
                            <span className="text-xs font-medium pm-text-secondary">
                              {getPasswordStrength(formData.password, t).feedback}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website" className="pm-label">
                        {t.website}
                      </Label>
                      <Input
                        id="website"
                        placeholder={t.websitePlaceholder}
                        value={formData.website}
                        onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                        className="pm-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category" className="pm-label">
                        {t.category}
                      </Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) => setFormData({ ...formData, category: value })}
                      >
                        <SelectTrigger className="pm-input">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent
                          className={`pm-select-content ${isDarkMode ? "password-manager-dark" : "password-manager-light"}`}
                        >
                          {categories.map((cat) => (
                            <SelectItem key={cat} value={cat} className="pm-select-item">
                              {cat}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="pm-label">
                        {t.notes}
                      </Label>
                      <Textarea
                        id="notes"
                        placeholder={t.notesPlaceholder}
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        rows={3}
                        className="pm-input"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSavePassword} className="pm-button-primary flex-1">
                        {editingPassword ? t.update : t.save}
                      </Button>
                      <Button variant="outline" onClick={resetForm} className="theme-toggle flex-1 bg-transparent">
                        {t.cancel}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid gap-4">
              {filteredPasswords.length === 0 ? (
                <Card className="password-card">
                  <CardContent className="flex flex-col items-center justify-center py-12">
                    <Key className="pm-text-muted w-12 h-12 mb-4 pm-bounce" />
                    <h3 className="pm-text-primary text-lg font-medium mb-2">{t.noPasswordsFound}</h3>
                    <p className="pm-text-secondary text-center mb-4">
                      {passwords.length === 0 ? t.startAdding : t.adjustFilters}
                    </p>
                    {passwords.length === 0 && (
                      <Button onClick={() => setIsDialogOpen(true)} className="pm-button-primary">
                        <Plus className="w-4 h-4 mr-2" />
                        {t.addFirstPassword}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                filteredPasswords.map((password) => {
                  const strength = getPasswordStrength(password.password, t)
                  return (
                    <Card key={password.id} className="password-card">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium truncate pm-text-primary">{password.title}</h3>
                              <Badge variant="secondary" className="text-xs pm-badge">
                                {password.category}
                              </Badge>
                              <div className="flex items-center gap-1">
                                {strength.score < 60 ? (
                                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                                ) : (
                                  <CheckCircle className="w-4 h-4 text-blue-600" />
                                )}
                                <span className="text-xs pm-text-secondary">{strength.feedback}</span>
                              </div>
                            </div>
                            {password.username && <p className="text-sm pm-text-secondary mb-1">{password.username}</p>}
                            {password.website && <p className="text-sm pm-text-secondary mb-2">{password.website}</p>}
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 flex-1 min-w-0">
                                <Input
                                  type={visiblePasswords.has(password.id) ? "text" : "password"}
                                  value={password.password}
                                  readOnly
                                  className="text-sm font-mono pm-input"
                                />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => togglePasswordVisibility(password.id)}
                                  className="theme-toggle"
                                >
                                  {visiblePasswords.has(password.id) ? (
                                    <EyeOff className="w-4 h-4" />
                                  ) : (
                                    <Eye className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() =>
                                    copyToClipboard(password.password, t.passwordRequired.replace(" *", ""))
                                  }
                                  className="theme-toggle"
                                >
                                  <Copy className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-1 ml-4">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                setEditingPassword(password)
                                setFormData({
                                  title: password.title,
                                  username: password.username,
                                  password: password.password,
                                  website: password.website,
                                  category: password.category,
                                  notes: password.notes,
                                })
                                setIsDialogOpen(true)
                              }}
                              className="theme-toggle"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-red-600 hover:bg-red-50">
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent
                                className={`pm-dialog-content ${isDarkMode ? "password-manager-dark" : "password-manager-light"}`}
                              >
                                <AlertDialogHeader>
                                  <AlertDialogTitle className="pm-text-primary">{t.confirmDelete}</AlertDialogTitle>
                                  <AlertDialogDescription className="pm-text-secondary">
                                    {t.deleteConfirmation} "{password.title}"? {t.actionUndoable}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="theme-toggle">{t.cancel}</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDeletePassword(password.id)}
                                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                  >
                                    {t.delete}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="security-card">
                <CardHeader>
                  <CardTitle className="pm-text-primary flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    {t.securityStats}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="pm-text-secondary">{t.totalPasswords}</span>
                    <Badge variant="outline" className="pm-badge">
                      {securityStats.total}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="pm-text-secondary">{t.weakPasswords}</span>
                    <Badge variant="destructive">{securityStats.weak}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="pm-text-secondary">{t.strongPasswords}</span>
                    <Badge className="bg-green-600 hover:bg-green-700">{securityStats.strong}</Badge>
                  </div>

                  <div className="pt-4 border-t border-slate-600">
                    <Dialog open={isResetDialogOpen} onOpenChange={setIsResetDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          className="theme-toggle bg-transparent"
                          onClick={() => setIsResetDialogOpen(true)}
                        >
                          {t.changeMasterPassword}
                        </Button>
                      </DialogTrigger>
                      <DialogContent
                        className={`pm-dialog-content ${isDarkMode ? "password-manager-dark" : "password-manager-light"}`}
                      >
                        <DialogHeader>
                          <DialogTitle className="pm-text-primary">{t.changeMasterPassword}</DialogTitle>
                          <DialogDescription className="pm-text-secondary">
                            {t.changeMasterPasswordDesc}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="old-master-password" className="pm-label">
                              {t.currentMasterPassword}
                            </Label>
                            <Input
                              id="old-master-password"
                              type="password"
                              placeholder={t.enterCurrentPassword}
                              value={oldMasterPassword}
                              onChange={(e) => setOldMasterPassword(e.target.value)}
                              className="pm-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="new-master-password" className="pm-label">
                              {t.newMasterPassword}
                            </Label>
                            <Input
                              id="new-master-password"
                              type="password"
                              placeholder={t.enterNewPassword}
                              value={newMasterPassword}
                              onChange={(e) => setNewMasterPassword(e.target.value)}
                              className="pm-input"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirm-new-master-password" className="pm-label">
                              {t.confirmNewMasterPassword}
                            </Label>
                            <Input
                              id="confirm-new-master-password"
                              type="password"
                              placeholder={t.confirmNewPassword}
                              value={confirmNewMasterPassword}
                              onChange={(e) => setConfirmNewMasterPassword(e.target.value)}
                              onKeyPress={(e) => e.key === "Enter" && handleResetMasterPassword()}
                              className="pm-input"
                            />
                          </div>
                          <div className="flex gap-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setIsResetDialogOpen(false)
                                setOldMasterPassword("")
                                setNewMasterPassword("")
                                setConfirmNewMasterPassword("")
                              }}
                              className="flex-1 theme-toggle"
                            >
                              {t.cancel}
                            </Button>
                            <Button onClick={handleResetMasterPassword} className="flex-1 pm-button-primary">
                              {language === "pt" ? "Alterar Senha" : "Change Password"}
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>

              <Card className="password-card">
                <CardHeader>
                  <CardTitle className="pm-text-primary">{t.passwordGenerator}</CardTitle>
                  <CardDescription className="pm-text-secondary">{t.generateSecurePasswords}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    onClick={() => {
                      const newPassword = generateSecurePassword()
                      copyToClipboard(newPassword, t.passwordRequired.replace(" *", ""))
                    }}
                    className="pm-button-primary w-full"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    {t.generateNewPassword}
                  </Button>
                  <div className="pm-text-secondary text-sm">
                    <p>{t.minChars}</p>
                    <p>{t.includesAll}</p>
                    <p>{t.randomGenerated}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
