# LinkedIn Campaign Manager

A full-stack application for managing LinkedIn outreach campaigns with AI-powered message generation, built with Next.js, TypeScript, Mongoose, and MongoDB.

## Features

### Backend (Node.js + Express + TypeScript + MongoDB + Mongoose)
- **Campaign CRUD APIs**: Complete campaign management with Mongoose ODM
- **Schema Validation**: Robust data validation using Mongoose schemas
- **Status Management**: ACTIVE, INACTIVE, and soft-delete (DELETED) functionality
- **LinkedIn Message API**: AI-powered personalized message generation using OpenAI
- **Profile Management**: Store and search scraped LinkedIn profiles
- **RESTful Architecture**: Clean API design following REST principles

### Frontend (React + TypeScript)
- **Campaign Dashboard**: View, create, edit, and manage campaigns
- **Message Generator**: AI-powered LinkedIn message creation
- **Profile Search**: Browse and search scraped LinkedIn profiles
- **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- **Real-time Updates**: Instant feedback and status updates

## Database Models

### Campaign Schema (Mongoose)
\`\`\`javascript
{
  name: String (required, max 100 chars),
  description: String (required, max 500 chars),
  status: Enum ['ACTIVE', 'INACTIVE', 'DELETED'],
  leads: [String] (LinkedIn URLs with validation),
  accountIDs: [String],
  timestamps: true
}
\`\`\`

### LinkedIn Profile Schema (Mongoose)
\`\`\`javascript
{
  fullName: String (required, max 100 chars),
  jobTitle: String (required, max 150 chars),
  company: String (required, max 100 chars),
  location: String (required, max 100 chars),
  profileUrl: String (required, unique, LinkedIn URL),
  summary: String (optional, max 1000 chars),
  imageUrl: String (optional, valid URL),
  connectionDegree: Enum ['1st', '2nd', '3rd', '3rd+'],
  industry: String (optional, max 100 chars),
  scrapedAt: Date,
  isActive: Boolean,
  timestamps: true
}
\`\`\`

## API Endpoints

### Campaign Management
- `GET /api/campaigns` - Fetch all active campaigns
- `GET /api/campaigns/:id` - Fetch single campaign
- `POST /api/campaigns` - Create new campaign
- `PUT /api/campaigns/:id` - Update campaign
- `DELETE /api/campaigns/:id` - Soft delete campaign

### Profile Management
- `GET /api/profiles` - Fetch profiles with search and pagination
- `POST /api/profiles` - Create new profile

### Message Generation
- `POST /api/personalized-message` - Generate AI-powered LinkedIn message

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **AI**: OpenAI GPT-3.5-turbo via AI SDK
- **Deployment**: Vercel-ready

## Mongoose Features Used

- **Schema Validation**: Comprehensive field validation and constraints
- **Middleware**: Pre-save hooks for updating timestamps
- **Static Methods**: Custom query methods like `findActive()` and `searchProfiles()`
- **Instance Methods**: Methods like `softDelete()` and `toggleStatus()`
- **Indexes**: Optimized database queries with proper indexing
- **Virtuals**: Custom computed properties
- **Population**: Reference relationships between documents

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Set up environment variables:
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`
   
   Update `.env.local` with your values:
   \`\`\`
   MONGODB_URI=mongodb+srv://adarsh9540984:passwordpassword@cluster0.yju1yru.mongodb.net/linkedin-campaigns
   OPENAI_API_KEY=your_openai_api_key
   \`\`\`

4. Seed the database (optional):
   \`\`\`bash
   node scripts/seed-database.js
   \`\`\`

5. Run the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

6. Open [http://localhost:3000](http://localhost:3000)

## Database Connection

The application uses your provided MongoDB Atlas connection:
\`\`\`
mongodb+srv://adarsh9540984:passwordpassword@cluster0.yju1yru.mongodb.net/
\`\`\`

Mongoose handles connection pooling, reconnection logic, and provides a robust ODM layer with:
- Schema validation
- Middleware support
- Query building
- Population
- Indexing

## Validation Features

### Campaign Validation
- Name: Required, max 100 characters
- Description: Required, max 500 characters
- Status: Must be ACTIVE, INACTIVE, or DELETED
- Leads: Must be valid LinkedIn URLs
- Automatic timestamp management

### Profile Validation
- All required fields with appropriate length limits
- LinkedIn URL validation and uniqueness
- Optional fields with proper validation
- Search indexing for performance

## Advanced Features

- **Soft Delete**: Campaigns marked as DELETED remain in database
- **Search Functionality**: Full-text search across profiles
- **Pagination**: Efficient data loading with pagination
- **Error Handling**: Comprehensive validation error messages
- **Performance**: Database indexes for optimal query performance

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

The MongoDB connection string is already configured for your Atlas cluster.

## License

MIT License - see LICENSE file for details
