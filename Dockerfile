FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create public/json directory and copy dashboard.json for Parcel dev server to serve
# Parcel's default public directory is 'public/', so we create the JSON here for proper static file serving
RUN mkdir -p public/json && \
    if [ -f json/dashboard.json ]; then cp json/dashboard.json public/json/dashboard.json; else printf '{"urls":[{"emoji":"🍑","label":"Google","url":"https://google.com"},{"emoji":"📚","label":"GitHub","url":"https://github.com"}]}' > public/json/dashboard.json; fi

# Expose port for Parcel dev server
EXPOSE 1234

# Start the local file mode development server
CMD ["npm", "run", "serve"]
