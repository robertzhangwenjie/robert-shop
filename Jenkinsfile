pipeline {
  agent {
    label 'nodejs'
  }
  stages {
    stage('构建') {
      steps {
        sh '''npm install && npm run build'''
      }
    }
  }
}
