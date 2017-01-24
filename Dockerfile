# Build:
## docker build -t got-em .
# Run:
## docker run -d -p 3000:3000 --name got-em got-em
FROM node:7-onbuild
ONBUILD RUN npm build
EXPOSE 3000
