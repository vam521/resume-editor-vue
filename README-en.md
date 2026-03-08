# ResumeAI - Smart Resume Editor

[中文版](./README.md)

A powerful online resume editor with multi-template support, real-time preview, and PDF export.

## Features

- 📝 **Multi-section Editing** - Personal info, education, work experience, projects, skills, summary
- 🎨 **Multiple Templates** - Modern Tech, Classic Finance, Creative Design themes
- 👁️ **Real-time Preview** - What you see is what you get
- 📄 **PDF Export** - Export resume to PDF format
- 💾 **Data Persistence** - Import/export resume data
- ✨ **Drag & Drop** - Sort work experience and projects
- 📱 **Responsive Design** - Desktop and mobile friendly

## Tech Stack

- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite
- **UI Library**: Element Plus
- **Rich Text Editor**: TipTap
- **State Management**: Pinia
- **PDF Generation**: html2canvas + jsPDF
- **Drag & Drop**: SortableJS

## Project Structure

```
src/
├── components/
│   ├── ResumeEditor.vue      # Resume editor core component
│   ├── ResumePreview.vue     # Resume preview component
│   ├── ExportSettings.vue    # Export settings component
│   ├── TemplateLibrary.vue   # Template library component
│   └── RichTextEditor.vue   # Rich text editor component
├── views/
│   └── HomeView.vue          # Main page view
├── store/
│   └── resume.ts             # Resume state management
├── App.vue
├── main.ts
└── style.css
```

## Quick Start

### Install Dependencies

```bash
npm install
```

### Development

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

1. **Choose Template** - Select your preferred resume style from the template library
2. **Fill Information** - Complete each section with your personal details and experience
3. **Preview** - See the real-time preview of your resume
4. **Export PDF** - Adjust export settings and download as PDF

## Resume Sections

- 👤 **Personal Info** - Name, job target, contact details
- 🎓 **Education** - School, degree, enrollment date
- 💼 **Work Experience** - Company, position, duration, responsibilities
- 💡 **Projects** - Project name, role, technologies, description
- 🏆 **Skills** - Skill categories, skill tags, certifications
- 📝 **Summary** - Personal summary/self-evaluation

## Templates

### Modern Tech
Purple theme, modern and clean, suitable for tech positions

### Classic Finance
Deep blue tones, professional and stable, suitable for finance/business roles

### Creative Design
Colorful gradient background, lively and creative, suitable for design/creative roles

## License

MIT License
