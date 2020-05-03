apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  name: ingress-${appName}
  namespace: default
spec:
  rules:
  - host: robert.shop.yunxiao.com
    http:
      paths:
      - path:
        backend:
          serviceName: ${appName}
          servicePort: 80


