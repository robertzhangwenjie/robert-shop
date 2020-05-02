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
    targetPort: web
    nodePort: 30880
  selector:
    app: ${appName}
  type: NodePort

