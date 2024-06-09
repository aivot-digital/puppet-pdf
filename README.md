# Setup

Just run the following command to get PuppetPDF up and running:

```bash
docker run -d --name puppetpdf -p 3000:3000 ghcr.io/aivot-digital/puppet-pdf:latest
```

You can now access the PuppetPDF service at [http://localhost:3000](http://localhost:3000).

# Usage

This service exposes three endpoints:

- `/print` - Generate a PDF from a given HTML string
- `/render` - Render a given HTML string with handlebars and the provided data
- `/health` - Health check endpoint

## Print

The Payload must be a JSON object with the following properties:

```javascript
{
    html: string;
    headerTemplate: string;
    footerTemplate: string;
}
```

Returns a PDF file.

## Render

The Payload must be a JSON object with the following properties:

```javascript
{
    template: string;
    values: object;
}
```

Returns a PDF file.

## Health

Returns ok if the service is running and ready.