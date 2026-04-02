FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Ensure json directory exists with a default dashboard.json for Parcel dev server to serve
# The app requests json/dashboard.json which Parcel serves from the project root
RUN mkdir -p json && \
    if [ -f json/dashboard.json ]; then :; else printf '{"urls":[{"emoji":"🍑","label":"Google","url":"https://google.com"},{"emoji":"📚","label":"GitHub","url":"https://github.com"}]}' > json/dashboard.json; fi

# Expose port for Parcel dev server
EXPOSE 1234

# Start the local file mode development server
CMD ["npm", "run", "serve"]
