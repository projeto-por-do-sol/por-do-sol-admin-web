// Dados do app Web no console do Firebase (Configurações do projeto > Seus apps).
// A chave VAPID fica em Cloud Messaging > Certificados push da Web.
export const FIREBASE_CONFIG = {
  apiKey: 'AIzaSyDtRCDbnN950UmPm0YTetttOStZHTc_F7w',
  authDomain: 'teste-81515.firebaseapp.com',
  projectId: 'teste-81515',
  storageBucket: 'teste-81515.firebasestorage.app',
  messagingSenderId: '368657010540',
  appId: '1:368657010540:web:b33fe2da18b74ce09aed49',
}

export const FIREBASE_VAPID_KEY = 'BAPEPB525Dfw6hURLXDosAmrVYMJ5NU-ZTz5irSIUrD-PfoWfzX84dDws1L_CubFekDxiI19ua3QWaKCZuw8_yI'

export const FIREBASE_ENABLED = Object.values(FIREBASE_CONFIG).every(Boolean) && !!FIREBASE_VAPID_KEY
