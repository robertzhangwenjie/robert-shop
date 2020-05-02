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
        image: ${appName}:${commitId}
        ports:
        - name: http
          containerPort: 80
