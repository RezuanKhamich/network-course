# Статический сайт курсов на nginx
FROM nginx:1.27-alpine
COPY index.html ai-agents-course.html .nojekyll /usr/share/nginx/html/
COPY assets /usr/share/nginx/html/assets
COPY courses /usr/share/nginx/html/courses
EXPOSE 80
