apiVersion: v1
kind: Service
metadata:
  labels:
    app: ${appName}
  name: ${appName}
  namespace: default
spec:
  ports:
  - name: web
    port: 80
    targetPort: 80
  selector:
    app: ${appName}
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: ${appName}
  namespace: default
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${appName}
  template:
    metadata:
      labels:
        app: ${appName}
    spec:
      containers:
      - name: ${appName}
        image: ${imageName}
        ports:
        - name: http
          containerPort: 80
