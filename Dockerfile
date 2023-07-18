# Use below nginx version
FROM nginx:stable-alpine

# Copy the build folder of the react app

COPY ./build /var/www

# Copy the ngnix configrations
COPY nginx/nginx.conf /etc/nginx/nginx.conf

# Expose it on port 80
EXPOSE 8080

ENTRYPOINT ["nginx","-g","daemon off;"]
