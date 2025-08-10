# Idea Vault

A modern, full-stack web application for capturing, organizing, and searching through your ideas. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Create Ideas**: Add new ideas with titles, notes, and tags
- **Real-time Search**: Search through your ideas by title, note content, or tags
- **Tag Organization**: Organize ideas with comma-separated tags
- **Persistent Storage**: Ideas are stored in a database and persist between sessions
- **Responsive Design**: Clean, modern UI that works on all devices
- **Instant Updates**: Add and delete ideas without page refreshes

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API routes
- **Database**: (Configured via API routes)
- **State Management**: React hooks (useState, useEffect)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd idea-vault
```

2. Install dependencies:
```bash
npm install
```

3. Set up your environment variables (if needed):
```bash
# Create .env.local file and add any required environment variables
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Adding Ideas

1. Fill out the form at the top of the page:
   - **Title**: A brief description of your idea
   - **Note**: Detailed notes about your idea
   - **Tags**: Comma-separated tags for organization (optional)

2. Click "Add" to save your idea

### Searching Ideas

- Use the search bar to find specific ideas
- Search works across titles, notes, and tags
- Results update in real-time as you type

### Managing Ideas

- View all your ideas in a clean, card-based layout
- Each idea shows creation date and associated tags
- Delete ideas using the delete button on each card

## Project Structure

```
idea-vault/
├── src/
│   ├── app/
│   │   ├── ideas/
│   │   │   └── route.ts          # API endpoints for ideas
│   │   ├── layout.tsx            # Root layout component
│   │   ├── page.tsx              # Main page with idea management
│   │   └── globals.css           # Global styles
│   ├── lib/
│   │   └── store.ts              # Store configuration
│   └── types/
│       └── schema.ts             # TypeScript type definitions
├── public/                        # Static assets
├── package.json                   # Dependencies and scripts
└── README.md                      # This file
```

## API Endpoints

- `GET /api/ideas` - Retrieve all ideas
- `POST /api/ideas` - Create a new idea
- `DELETE /api/ideas?id={id}` - Delete an idea by ID

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Tailwind CSS for styling
- React functional components with hooks

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [SVG Repo](https://www.svgrepo.com/)
