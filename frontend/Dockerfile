# Use a lightweight Nginx image
FROM nginx:alpine

# Copy the static assets from the frontend directory
COPY ./index.html /usr/share/nginx/html/index.html
COPY ./dashboard.html /usr/share/nginx/html/dashboard.html
COPY ./style.css /usr/share/nginx/html/style.css

# Expose port 80
EXPOSE 80

# The default Nginx command will be run
CMD ["nginx", "-g", "daemon off;"]