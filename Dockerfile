FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create json directory and default dashboard.json
RUN mkdir -p json && \
    echo '{"urls":[{"emoji":"🍑","label":"Google","url":"https://google.com"},{"emoji":"📚","label":"GitHub","url":"https://github.com"}]}' > json/dashboard.json

# Expose port for Parcel dev server
EXPOSE 1234

# Start the local file mode development server
CMD ["npm", "run", "serve"]
