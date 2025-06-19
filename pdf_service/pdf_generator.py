from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_RIGHT, TA_LEFT
from reportlab.graphics.shapes import Drawing, Rect
from reportlab.graphics import renderPDF
import datetime
import os

# SAPPCON Brand Colors
SAPPCON_BLUE = colors.Color(0.161, 0.408, 0.808)  # #2968CE
SAPPCON_GOLD = colors.Color(0.706, 0.596, 0.373)  # #B4975F
LIGHT_GRAY = colors.Color(0.95, 0.95, 0.95)
DARK_GRAY = colors.Color(0.4, 0.4, 0.4)

def create_text_header():
    """Create a branded text header when logo is not available"""
    from reportlab.lib.styles import getSampleStyleSheet
    styles = getSampleStyleSheet()
    
    sappcon_title = Paragraph(
        '<font color="#2968CE" size="24"><b>SAPPCON</b></font><br/>'
        '<font color="#B4975F" size="14">CONSULTING FOR SAP APPLICATIONS</font><br/>'
        '<font color="#2968CE" size="10">Professional CV Service</font>',
        styles['Normal']
    )
    return sappcon_title

def generate_pdf(cv_data, output_path):
    """
    Generate a concise, professional PDF file from CV data with SAPPCON branding
    
    Args:
        cv_data (dict): CV data in JSON format
        output_path (str): Path to save the PDF file
    """
    # Create document with tighter margins
    doc = SimpleDocTemplate(
        output_path, 
        pagesize=A4,
        rightMargin=40,
        leftMargin=40,
        topMargin=30,
        bottomMargin=40
    )
    styles = getSampleStyleSheet()
    
    # Create compact branded styles
    title_style = ParagraphStyle(
        name='CustomTitle', 
        parent=styles['Heading1'], 
        fontSize=22,
        fontName='Helvetica-Bold',
        textColor=SAPPCON_BLUE,
        alignment=TA_CENTER,
        spaceAfter=12,
        spaceBefore=5
    )
    
    section_style = ParagraphStyle(
        name='CustomSection', 
        parent=styles['Heading2'], 
        fontSize=14,
        fontName='Helvetica-Bold',
        textColor=SAPPCON_BLUE,
        spaceAfter=6,
        spaceBefore=10,
        borderWidth=1,
        borderColor=SAPPCON_GOLD,
        borderPadding=4,
        backColor=LIGHT_GRAY
    )
    
    subsection_style = ParagraphStyle(
        name='CustomSubSection', 
        parent=styles['Heading3'], 
        fontSize=12,
        fontName='Helvetica-Bold',
        textColor=SAPPCON_BLUE,
        spaceAfter=3,
        spaceBefore=5
    )
    
    contact_style = ParagraphStyle(
        name='ContactStyle',
        parent=styles['Normal'],
        fontSize=10,
        fontName='Helvetica',
        textColor=DARK_GRAY,
        spaceAfter=2
    )
    
    body_style = ParagraphStyle(
        name='BodyStyle',
        parent=styles['Normal'],
        fontSize=10,
        fontName='Helvetica',
        textColor=colors.black,
        spaceAfter=3,
        alignment=TA_LEFT
    )
    
    # Content elements
    elements = []    # Compact header with logo and company branding
    header_data = []
    
    # Try to include logo if it exists
    logo_path = os.path.join(os.path.dirname(__file__), 'logo.png')
    if os.path.exists(logo_path):
        try:
            # Smaller, more efficient logo size
            logo = Image(logo_path, width=1.8*inch, height=0.7*inch)
            logo.hAlign = 'LEFT'
            
            # Compact company info
            company_info = Paragraph(
                '<font color="#B4975F" size="12"><b>CONSULTING FOR SAP APPLICATIONS</b></font>',
                styles['Normal']
            )
            
            header_data.append([logo, company_info])
        except Exception as e:
            print(f"Logo loading error: {e}")
            # Fallback to text header
            header_data.append([create_text_header()])
    else:
        # Create a branded text header when logo is not available
        header_data.append([create_text_header()])
    
    if header_data:
        header_table = Table(header_data, colWidths=[3*inch, 4*inch])
        header_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, 0), 'LEFT'),    # Logo left
            ('ALIGN', (1, 0), (1, 0), 'RIGHT'),   # Company info right
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('TOPPADDING', (0, 0), (-1, -1), 5),
        ]))
        elements.append(header_table)
        elements.append(Spacer(1, 0.15 * inch))
      # CV Title with candidate name
    name = f"{cv_data.get('first_name', '')} {cv_data.get('last_name', '')}"
    elements.append(Paragraph(name, title_style))
    
    # Brief professional title (if summary exists, use first sentence only)
    if cv_data.get('summary'):
        title_line = cv_data.get('summary', '').split('.')[0][:80] + ("..." if len(cv_data.get('summary', '')) > 80 else "")
        title_para = ParagraphStyle(
            name='TitleLine',
            parent=styles['Normal'],
            fontSize=12,
            fontName='Helvetica-Oblique',
            textColor=SAPPCON_GOLD,
            alignment=TA_CENTER,
            spaceAfter=8
        )
        elements.append(Paragraph(title_line, title_para))
    
    elements.append(Spacer(1, 0.1 * inch))
      # Compact Contact Information in single line
    elements.append(Paragraph("Contact", section_style))
    
    contact_info = []
    if cv_data.get('email'):
        contact_info.append(f"✉ {cv_data.get('email')}")
    if cv_data.get('phone'):
        phones = cv_data.get('phone') if isinstance(cv_data.get('phone'), list) else [cv_data.get('phone')]
        contact_info.append(f"📞 {', '.join(phones)}")
    if cv_data.get('location'):
        contact_info.append(f"📍 {cv_data.get('location')}")
    
    if contact_info:
        contact_text = " | ".join(contact_info)
        elements.append(Paragraph(contact_text, contact_style))
    
    elements.append(Spacer(1, 0.1 * inch))
    
    # Summary with compact styling
    if cv_data.get('summary'):
        elements.append(Paragraph("Summary", section_style))
        summary_text = cv_data.get('summary', '')
        elements.append(Paragraph(summary_text, body_style))
        elements.append(Spacer(1, 0.1 * inch))
    
    # Skills with compact styling
    if cv_data.get('skills', []):
        elements.append(Paragraph("Skills", section_style))
        
        skills = cv_data.get('skills', [])
        # Create a more compact skills list
        skills_list = skills if isinstance(skills, list) else [str(skills)]
        skills_text = " • ".join(skills_list)
        elements.append(Paragraph(skills_text, body_style))
        elements.append(Spacer(1, 0.1 * inch))    # Experience with compact styling
    experience = cv_data.get('expertise', [])
    if experience:
        elements.append(Paragraph("Experience", section_style))
        
        for exp in experience:
            company = exp.get('company', 'Unknown Company')
            role = exp.get('role', 'Unknown Position')
            date = exp.get('date', 'Unknown Date')
            description = exp.get('description', '')
            
            # Create compact experience entry
            role_company = f'<font color="#2968CE"><b>{role}</b></font> at <font color="#B4975F">{company}</font> ({date})'
            elements.append(Paragraph(role_company, body_style))
            
            if description:
                # Truncate long descriptions
                desc_text = description[:200] + "..." if len(description) > 200 else description
                elements.append(Paragraph(desc_text, body_style))
            elements.append(Spacer(1, 0.08 * inch))
        
        elements.append(Spacer(1, 0.05 * inch))    # Education with compact styling
    education = cv_data.get('education', [])
    if education:
        elements.append(Paragraph("Education", section_style))
        
        for edu in education:
            institution = edu.get('institution', 'Unknown Institution')
            degree = edu.get('degree', 'Unknown Degree')
            start_date = edu.get('start_date', '')
            end_date = edu.get('end_date', 'Present')
            location = edu.get('location', '')
            
            # Create compact education entry
            degree_text = f'<font color="#2968CE"><b>{degree}</b></font> - <font color="#B4975F">{institution}</font>'
            if start_date or end_date:
                date_range = f" ({start_date}-{end_date})" if start_date else f" ({end_date})"
                degree_text += date_range
            
            elements.append(Paragraph(degree_text, body_style))
            elements.append(Spacer(1, 0.05 * inch))
        
        elements.append(Spacer(1, 0.05 * inch))    # Projects with compact styling
    projects = cv_data.get('projects', [])
    if projects:
        elements.append(Paragraph("Projects", section_style))
        
        for proj in projects:
            name = proj.get('project_name', 'Unknown Project')
            industry = proj.get('industry', '')
            country = proj.get('country', '')
            role = proj.get('role', '')
            
            # Create compact project entry
            project_line = f'<font color="#2968CE"><b>{name}</b></font>'
            if role:
                project_line += f' - <font color="#B4975F">{role}</font>'
            if industry:
                project_line += f' ({industry})'
            
            elements.append(Paragraph(project_line, body_style))
            elements.append(Spacer(1, 0.05 * inch))        
        elements.append(Spacer(1, 0.05 * inch))
    
    # Certificates with compact styling
    certificates = cv_data.get('certificates', [])
    if certificates:
        elements.append(Paragraph("Certifications", section_style))
        
        cert_list = []
        for cert in certificates:
            if isinstance(cert, str):
                cert_list.append(cert)
            else:
                name = cert.get('name', 'Unknown Certificate')
                cert_list.append(name)
        
        # Display certificates in a compact format
        certs_text = " • ".join(cert_list)
        elements.append(Paragraph(certs_text, body_style))
        elements.append(Spacer(1, 0.1 * inch))
      # Hobbies & Interests with compact styling
    if cv_data.get('hobbies', []):
        elements.append(Paragraph("Interests", section_style))
        
        hobbies = cv_data.get('hobbies', [])
        if isinstance(hobbies, list):
            hobbies_text = " • ".join(hobbies)
        else:
            hobbies_text = str(hobbies)
        
        elements.append(Paragraph(hobbies_text, body_style))
        elements.append(Spacer(1, 0.1 * inch))
    
    # Professional footer with SAPPCON branding
    footer_style = ParagraphStyle(
        name='Footer',
        parent=body_style,
        fontSize=10,
        textColor=DARK_GRAY,
        alignment=TA_CENTER,
        spaceAfter=10,
        spaceBefore=20
    )
    
    footer_content = (
        f'<font color="#2968CE">CV generated by SAPPCON Professional CV Service</font><br/>'
        f'<font color="#B4975F">Generated on {datetime.datetime.now().strftime("%B %d, %Y")}</font>'
    )
    elements.append(Paragraph(footer_content, footer_style))
    
    # Build PDF
    doc.build(elements)
