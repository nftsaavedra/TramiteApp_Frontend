import { ContentSection } from '../components/content-section'
import { AccountForm } from './account-form'

export function SettingsAccount() {
  return (
    <ContentSection
      title='Seguridad'
      desc='Actualiza tu contraseña y configuración de seguridad.'
    >
      <AccountForm />
    </ContentSection>
  )
}
