pipeline {

	agent any
	tools {
		docker 'docker'
	}
	stages {

		stage("build") {

			steps {
				echo 'building the app...'
				withCredentials([usernamePassword(credentialsId: 'docker-credentials', passwordVariable: 'PASS', usernameVariable: 'USER' )]){
					sh 'docker build -t guycohen85/app-from-jenkins:1.0 .'
					sh "echo $PASS | docker login -u $USER --password-stdin"
					sh 'docker push guycohen85/app-from-jenkins:1.0'
				}
			}

		}

		stage("test") {

			steps {
				echo 'testing the app...'
			}

		}

		stage("deploy") {

			steps {
				echo 'deploying the app...'
			}

		}

	}
}