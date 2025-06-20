from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Frame, PageTemplate, FrameBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, mm
from reportlab.lib.enums import TA_LEFT
from reportlab.platypus.doctemplate import BaseDocTemplate
from reportlab.pdfgen import canvas
import os

# SAPPCON Brand Colors
SAPPCON_DARK_BLUE = colors.Color(0.08, 0.22, 0.51)
SAPPCON_BLUE = colors.Color(0.20, 0.45, 0.75)
SAPPCON_LIGHT_BLUE = colors.Color(0.52, 0.73, 0.93)

class CVPageTemplate(PageTemplate):
    """Custom page template with colored band and logo precisely positioned at the top of the page"""
    
    def __init__(self, id, frames, pagesize=landscape(A4)):
        PageTemplate.__init__(self, id, frames, pagesize=pagesize)
        self.pagesize = pagesize
        
    def beforeDrawPage(self, canvas, doc):
        """Draw colored band and logo directly on the canvas, before any content"""
        canvas.saveState()
        
        # Get page dimensions
        page_width, page_height = self.pagesize
        
        # Draw colored top band (full width, no margins)
        band_height = 8*mm
        band_width = page_width
        
        # Draw three colored rectangles for the band
        # Dark blue section
        canvas.setFillColor(SAPPCON_DARK_BLUE)
        canvas.rect(0, page_height - band_height, band_width/3, band_height, fill=1, stroke=0)
        
        # Medium blue section
        canvas.setFillColor(SAPPCON_BLUE)
        canvas.rect(band_width/3, page_height - band_height, band_width/3, band_height, fill=1, stroke=0)
        
        # Light blue section
        canvas.setFillColor(SAPPCON_LIGHT_BLUE)
        canvas.rect(2*band_width/3, page_height - band_height, band_width/3, band_height, fill=1, stroke=0)        
        # Draw logo in TRUE top-right corner
        logo_width = 1.2*inch
        logo_height = 0.6*inch
        logo_x = page_width - logo_width - 0.3*inch
        logo_y = page_height - logo_height - 0.3*inch
        
        # Try to load logo image
        logo_paths = [
            os.path.join(os.path.dirname(__file__), 'logo.png'),
            os.path.join(os.path.dirname(__file__), '..', 'client', 'LOGO.ico'),
        ]
        
        logo_drawn = False
        for logo_path in logo_paths:
            if os.path.exists(logo_path):
                try:
                    canvas.drawImage(logo_path, logo_x, logo_y, width=logo_width, height=logo_height, preserveAspectRatio=True)
                    print(f"Logo drawn from: {logo_path}")
                    logo_drawn = True
                    break
                except Exception as e:
                    print(f"Failed to draw logo from {logo_path}: {e}")
                    continue
        
        # Fallback to text logo if image loading fails
        if not logo_drawn:
            print("Using fallback text logo")
            canvas.setFillColor(SAPPCON_BLUE)
            canvas.rect(logo_x, logo_y, logo_width, logo_height, fill=1, stroke=0)
            canvas.setFillColor(colors.white)
            canvas.setFont("Helvetica-Bold", 12)
            text_width = canvas.stringWidth("SAPPCON", "Helvetica-Bold", 12)
            text_x = logo_x + (logo_width - text_width) / 2
            text_y = logo_y + (logo_height - 12) / 2
            canvas.drawString(text_x, text_y, "SAPPCON")
        
        canvas.restoreState()

def create_styles():
    """Create compact styles for single-page CV"""
    styles = getSampleStyleSheet()
    
    return {
        'name': ParagraphStyle(
            'NameStyle', parent=styles['Normal'],
            fontSize=12, fontName='Helvetica-Bold', textColor=colors.black,
            alignment=TA_LEFT, spaceAfter=2, spaceBefore=0
        ),
        'job_title': ParagraphStyle(
            'JobTitleStyle', parent=styles['Normal'],
            fontSize=9, fontName='Helvetica', textColor=colors.black,
            alignment=TA_LEFT, spaceAfter=2, spaceBefore=0
        ),
        'contact': ParagraphStyle(
            'ContactStyle', parent=styles['Normal'],
            fontSize=8, fontName='Helvetica', textColor=colors.black,
            alignment=TA_LEFT, spaceAfter=1, spaceBefore=0
        ),
        'section_header': ParagraphStyle(
            'SectionHeader', parent=styles['Normal'],
            fontSize=9, fontName='Helvetica-Bold', textColor=colors.black,
            alignment=TA_LEFT, spaceAfter=2, spaceBefore=4
        ),
        'body': ParagraphStyle(
            'BodyText', parent=styles['Normal'],
            fontSize=8, fontName='Helvetica', textColor=colors.black,
            spaceAfter=1, alignment=TA_LEFT
        ),
        'job_company': ParagraphStyle(
            'JobCompany', parent=styles['Normal'],
            fontSize=8, fontName='Helvetica-Bold', textColor=colors.black,
            spaceAfter=1, spaceBefore=1
        ),
        'job_title_entry': ParagraphStyle(
            'JobTitleEntry', parent=styles['Normal'],
            fontSize=8, fontName='Helvetica', textColor=colors.black,
            spaceAfter=0
        ),
        'date': ParagraphStyle(
            'DateStyle', parent=styles['Normal'],
            fontSize=7, fontName='Helvetica-Oblique', textColor=colors.gray,
            spaceAfter=2
        ),
        'list_item': ParagraphStyle(
            'ListItem', parent=styles['Normal'],
            fontSize=8, fontName='Helvetica', textColor=colors.black,
            spaceAfter=1, leftIndent=0
        )
    }

def add_spacer(elements, height_mm=3):
    """Add spacing between elements"""
    elements.append(Spacer(1, height_mm*mm))

def generate_pdf(cv_data, output_path):
    """Generate a clean, professional three-column landscape CV"""
    
    # Create document
    doc = BaseDocTemplate(
        output_path,
        pagesize=landscape(A4),
        topMargin=0.5*inch,
        bottomMargin=0.5*inch,
        leftMargin=0.5*inch,
        rightMargin=0.5*inch
    )
    
    # Calculate layout
    page_width, page_height = landscape(A4)
    margin = 0.5*inch
    usable_width = page_width - (2 * margin)
    col_gap = 0.2*inch
    col_width = (usable_width - (2 * col_gap)) / 3
    top_offset = 15*mm  # Space for colored band
    adjusted_height = page_height - (2 * margin) - top_offset
    
    # Create three column frames
    left_frame = Frame(margin, margin, col_width, adjusted_height, id='left_col', 
                      leftPadding=3*mm, rightPadding=3*mm, topPadding=0, bottomPadding=0)
    center_frame = Frame(margin + col_width + col_gap, margin, col_width, adjusted_height, 
                        id='center_col', leftPadding=3*mm, rightPadding=3*mm, topPadding=0, bottomPadding=0)
    right_frame = Frame(margin + 2*(col_width + col_gap), margin, col_width, adjusted_height, 
                       id='right_col', leftPadding=3*mm, rightPadding=3*mm, topPadding=0, bottomPadding=0)
    
    # Add page template with colored band and logo
    page_template = CVPageTemplate('main', [left_frame, center_frame, right_frame])
    doc.addPageTemplates([page_template])
    
    # Get styles and create content
    styles = create_styles()
    elements = []
    
    # === LEFT COLUMN ===
    add_spacer(elements, 5)  # Space for band
    
    # Name and basic info
    name = f"{cv_data.get('first_name', '')} {cv_data.get('last_name', '')}".strip()
    if name:
        elements.append(Paragraph(name, styles['name']))
    
    # Job title from summary
    summary = cv_data.get('summary', '')
    if summary:
        job_title = summary.split('.')[0].strip()[:60]
    else:
        job_title = "Professional"
    elements.append(Paragraph(job_title, styles['job_title']))
    add_spacer(elements)
    
    # Contact info
    for field in ['location', 'email']:
        if cv_data.get(field):
            elements.append(Paragraph(cv_data[field], styles['contact']))
    
    # Phone numbers
    phones = cv_data.get('phone', [])
    for phone in phones[:2]:
        if phone:
            clean_phone = phone.replace("tel:", "").replace("phone:", "").strip()
            elements.append(Paragraph(clean_phone, styles['contact']))
    
    if cv_data.get('linkedin'):
        elements.append(Paragraph(cv_data['linkedin'], styles['contact']))
    
    add_spacer(elements, 5)
    
    # Languages
    languages = cv_data.get('language', [])
    if languages:
        elements.append(Paragraph("Languages", styles['section_header']))
        for lang in languages:
            elements.append(Paragraph(lang, styles['list_item']))
        add_spacer(elements, 5)
    
    # Skills
    skills = cv_data.get('skills', [])
    if skills:
        elements.append(Paragraph("Skills", styles['section_header']))
        for skill in skills[:8]:
            elements.append(Paragraph(skill, styles['list_item']))
        add_spacer(elements, 5)
    
    # Hobbies
    hobbies = cv_data.get('hobbies', [])
    if hobbies:
        elements.append(Paragraph("Interests", styles['section_header']))
        for hobby in hobbies[:5]:
            elements.append(Paragraph(hobby, styles['list_item']))
    
    # === CENTER COLUMN ===
    elements.append(FrameBreak())
    
    # Professional Summary
    if summary:
        elements.append(Paragraph("Professional Summary", styles['section_header']))
        # Truncate if too long
        display_summary = summary[:300] + "..." if len(summary) > 300 else summary
        elements.append(Paragraph(display_summary, styles['body']))
        add_spacer(elements, 5)
    
    # Education
    education = cv_data.get('education', [])
    if education:
        elements.append(Paragraph("Education", styles['section_header']))
        for edu in education:
            if edu.get('degree'):
                elements.append(Paragraph(edu['degree'], styles['job_title_entry']))
            if edu.get('institution'):
                elements.append(Paragraph(edu['institution'], styles['job_company']))
            if edu.get('start_date') and edu.get('end_date'):
                date_range = f"{edu['start_date']} - {edu['end_date']}"
                elements.append(Paragraph(date_range, styles['date']))
            add_spacer(elements)
        add_spacer(elements, 5)
    
    # Certificates
    certificates = cv_data.get('certificates', [])
    if certificates:
        elements.append(Paragraph("Certifications", styles['section_header']))
        for cert in certificates[:6]:
            elements.append(Paragraph(cert, styles['list_item']))
        add_spacer(elements, 5)
    
    # === RIGHT COLUMN ===
    elements.append(FrameBreak())
    
    # Professional Experience
    experience = cv_data.get('expertise', [])
    if experience:
        elements.append(Paragraph("Professional Experience", styles['section_header']))
        for exp in experience:
            if exp.get('role'):
                elements.append(Paragraph(exp['role'], styles['job_title_entry']))
            if exp.get('company'):
                elements.append(Paragraph(exp['company'], styles['job_company']))
            if exp.get('date'):
                elements.append(Paragraph(exp['date'], styles['date']))
            if exp.get('description'):
                desc = exp['description'][:150] + "..." if len(exp['description']) > 150 else exp['description']
                elements.append(Paragraph(desc, styles['body']))
            add_spacer(elements)
        add_spacer(elements, 5)
    
    # Projects
    projects = cv_data.get('projects', [])
    if projects:
        elements.append(Paragraph("Project Experience", styles['section_header']))
        for proj in projects:
            if proj.get('project_name'):
                elements.append(Paragraph(proj['project_name'], styles['job_title_entry']))
            if proj.get('role'):
                elements.append(Paragraph(proj['role'], styles['job_company']))
            if proj.get('industry') and proj.get('country'):
                location_industry = f"{proj['industry']}, {proj['country']}"
                elements.append(Paragraph(location_industry, styles['date']))
            add_spacer(elements)
    
    # Build PDF
    try:
        doc.build(elements)
        print(f"PDF generated successfully: {output_path}")
        return True
    except Exception as e:
        print(f"Error generating PDF: {e}")
        return False
