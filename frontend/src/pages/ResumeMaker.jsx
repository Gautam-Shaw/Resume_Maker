import { useState, useRef, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import html2pdf from "html2pdf.js";

const ResumeMaker = () => {
  useEffect(() => {
    localStorage.removeItem("formData");
  }, []);

  const [formData, setFormData] = useState({
    photo: "",
    name: "",
    email: "",
    phone: "",
    objective: "",
    education: [{ degree: "", college: "", year: "", cgpa: "" }],
    experience: [{ company: "", role: "" }],
    projects: [{ name: "", techStack: "", description: "" }],
    skills: [""],
    certifications: [{ title: "", company: "", skills: "" }],
    languagesKnown: [""]
  });

  const handleChange = (e, index, section) => {
    const { name, value } = e.target;
    if (section) {
      const updatedSection = [...formData[section]];
      if (section === "skills" || section === "languagesKnown") {
        updatedSection[index] = value;
      } else {
        updatedSection[index][name] = value;
      }
      setFormData({ ...formData, [section]: updatedSection });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({ ...prevData, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addField = (section, emptyObj) => {
    setFormData({ ...formData, [section]: [...formData[section], emptyObj] });
  };

  const removeField = (section, index) => {
    const updatedSection = formData[section].filter((_, i) => i !== index);
    setFormData({ ...formData, [section]: updatedSection });
  };

  const resumeRef = useRef();
  const handlePrint = useReactToPrint({ content: () => resumeRef.current });

  let previewWindow = null;

  const handlePreview = (action) => {
    let previewContent = `
      <html>
        <head>
          <title>Resume Preview</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9; color: #333; }
            .resume-header { display: flex; align-items: center; margin-bottom: 20px; }
            .resume-photo { width: 100px; height: 100px; object-fit: cover; border-radius: 50%; margin-right: 20px; border: 2px solid #ccc; }
            .resume-name { font-size: 28px; font-weight: bold; text-transform: uppercase; color: #2c3e50; }
            .resume-contact { font-size: 16px; color: #7f8c8d; }
            .resume-contact p { margin: 0; }
            .resume-section { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .resume-section h3 { margin-bottom: 10px; color: #2980b9; }
            .resume-section p { margin: 5px 0; }
            .resume-container { max-width: 800px; margin: 0 auto; background-color: #fff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            @page { size: A4; margin: 20mm; }
            @media print {
              body { width: 210mm; height: 297mm; }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <div class="resume-header">
              ${formData.photo ? `<img src="${formData.photo}" alt="Profile Photo" class="resume-photo" />` : ""}
              <div>
                <div class="resume-name">${formData.name}</div>
                <div class="resume-contact">
                  <p>${formData.phone} | ${formData.email}</p>
                </div>
              </div>
            </div>
            <div class="resume-section">
              <h3>Objective</h3>
              <p>${formData.objective}</p>
            </div>
            <div class="resume-section">
              <h3>Education</h3>
              ${formData.education.map(edu => `
                <p><strong>${edu.college}</strong></p>
                <p><strong>Degree:</strong> ${edu.degree} – <strong>CGPA:</strong> ${edu.cgpa} – <strong>Year:</strong> ${edu.year}</p>
              `).join('')}
            </div>
            <div class="resume-section">
              <h3>Experience</h3>
              ${formData.experience.map(exp => `
                <p><strong>Company:</strong> ${exp.company}</p>
                <p><strong>Role:</strong> ${exp.role}</p>
              `).join('')}
            </div>
            <div class="resume-section">
              <h3>Skills</h3>
              ${formData.skills.map(skill => `<p>${skill}</p>`).join('')}
            </div>
            <div class="resume-section">
              <h3>Projects</h3>
              ${formData.projects.map(proj => `
                <p><strong>Name:</strong> ${proj.name}</p>
                <p><strong>Tech Stack:</strong> ${proj.techStack}</p>
                <p><strong>Description:</strong> ${proj.description}</p>
              `).join('')}
            </div>
            <div class="resume-section">
              <h3>Certifications</h3>
              ${formData.certifications.map(cert => `
                <p><strong>Title:</strong> ${cert.title}</p>
                <p><strong>Company:</strong> ${cert.company}</p>
                <p><strong>Skills:</strong> ${cert.skills}</p>
              `).join('')}
            </div>
            <div class="resume-section">
              <h3>Languages Known</h3>
              ${formData.languagesKnown.map(lang => `<p>${lang}</p>`).join('')}
            </div>
          </div>
        </body>
      </html>
    `;

    if (action === 'preview') {
      if (previewWindow && !previewWindow.closed) {
        previewWindow.document.open();
        previewWindow.document.write(previewContent);
        previewWindow.document.close();
      } else {
        previewWindow = window.open("", "_blank");
        previewWindow.document.write(previewContent);
        previewWindow.document.close();
      }
    } else if (action === 'download') {
      const blob = new Blob([previewContent], { type: 'text/html' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'resume.html';
      link.click();
    } else if (action === 'share') {
      const element = document.createElement('div');
      element.innerHTML = previewContent;
      const opt = {
        margin: 0,
        filename: 'resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };
      html2pdf().from(element).set(opt).outputPdf('datauristring').then((pdfDataUri) => {
        const pdfBlob = dataURItoBlob(pdfDataUri);
        const file = new File([pdfBlob], 'resume.pdf', { type: 'application/pdf' });
        const shareData = {
          title: 'Resume',
          text: 'Check out my resume!',
          files: [file]
        };
        if (navigator.canShare && navigator.canShare(shareData)) {
          navigator.share(shareData).catch(console.error);
        } else {
          alert('Sharing not supported on this browser.');
        }
      });
    }
  };

  // Helper function to convert data URI to Blob
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  const handleDownloadPDF = () => {
    const element = document.createElement('div');
    element.innerHTML = `
      <html>
        <head>
          <title>Resume PDF</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f9; color: #333; }
            .resume-header { display: flex; align-items: center; margin-bottom: 20px; }
            .resume-photo { width: 100px; height: 100px; object-fit: cover; border-radius: 50%; margin-right: 20px; border: 2px solid #ccc; }
            .resume-name { font-size: 28px; font-weight: bold; text-transform: uppercase; color: #2c3e50; }
            .resume-contact { font-size: 16px; color: #7f8c8d; }
            .resume-contact p { margin: 0; }
            .resume-section { margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 10px; }
            .resume-section h3 { margin-bottom: 10px; color: #2980b9; }
            .resume-section p { margin: 5px 0; }
            .resume-container { max-width: 800px; margin: 0 auto; background-color: #fff; padding: 20px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
            @page { size: A4; margin: 20mm; }
            @media print {
              body { width: 210mm; height: 297mm; }
            }
          </style>
        </head>
        <body>
          <div class="resume-container">
            <div class="resume-header">
              ${formData.photo ? `<img src="${formData.photo}" alt="Profile Photo" class="resume-photo" />` : ""}
              <div>
                <div class="resume-name">${formData.name}</div>
                <div class="resume-contact">
                  <p>${formData.phone} | ${formData.email}</p>
                </div>
              </div>
            </div>
            <div class="resume-section">
              <h3>Objective</h3>
              <p>${formData.objective}</p>
            </div>
            <div class="resume-section">
              <h3>Education</h3>
              ${formData.education.map(edu => `
                <p><strong>${edu.college}</strong></p>
                <p><strong>Degree:</strong> ${edu.degree} – <strong>CGPA:</strong> ${edu.cgpa} – <strong>Year:</strong> ${edu.year}</p>
              `).join('')}
            </div>
            <div class="resume-section">
              <h3>Experience</h3>
              ${formData.experience.map(exp => `
                <p><strong>Company:</strong> ${exp.company}</p>
                <p><strong>Role:</strong> ${exp.role}</p>
              `).join('')}
            </div>
            <div class="resume-section">
              <h3>Skills</h3>
              ${formData.skills.map(skill => `<p>${skill}</p>`).join('')}
            </div>
            <div class="resume-section">
              <h3>Projects</h3>
              ${formData.projects.map(proj => `
                <p><strong>Name:</strong> ${proj.name}</p>
                <p><strong>Tech Stack:</strong> ${proj.techStack}</p>
                <p><strong>Description:</strong> ${proj.description}</p>
              `).join('')}
            </div>
            <div class="resume-section">
              <h3>Certifications</h3>
              ${formData.certifications.map(cert => `
                <p><strong>Title:</strong> ${cert.title}</p>
                <p><strong>Company:</strong> ${cert.company}</p>
                <p><strong>Skills:</strong> ${cert.skills}</p>
              `).join('')}
            </div>
            <div class="resume-section">
              <h3>Languages Known</h3>
              ${formData.languagesKnown.map(lang => `<p>${lang}</p>`).join('')}
            </div>
          </div>
        </body>
      </html>
    `;
    const opt = {
      margin: 0,
      filename: 'resume.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().from(element).set(opt).save();
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
      <h2 className="text-3xl font-bold mb-6">Resume Maker</h2>

      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <form className="space-y-4">
          <h3 className="text-lg font-semibold">Basic Informations</h3>
          <input type="file" onChange={handlePhotoUpload} className="w-full p-2 border rounded" />
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded uppercase" />
          <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} className="w-full p-2 border rounded" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" />
          <textarea name="objective" placeholder="Career Objective" value={formData.objective} onChange={handleChange} className="w-full p-2 border rounded"></textarea>

          <h3 className="text-lg font-semibold">Education</h3>
          {formData.education.map((edu, index) => (
            <div key={index} className="space-y-2 border p-2 rounded">
              <input type="text" name="college" placeholder="College" value={edu.college} onChange={(e) => handleChange(e, index, "education")} className="w-full p-2 border rounded" />
              <input type="text" name="degree" placeholder="Degree" value={edu.degree} onChange={(e) => handleChange(e, index, "education")} className="w-full p-2 border rounded" />
              <input type="text" name="cgpa" placeholder="CGPA" value={edu.cgpa} onChange={(e) => handleChange(e, index, "education")} className="w-full p-2 border rounded" />
              <input type="text" name="year" placeholder="Year" value={edu.year} onChange={(e) => handleChange(e, index, "education")} className="w-full p-2 border rounded" />
              <button type="button" onClick={() => removeField("education", index)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addField("education", { college: "", degree: "", cgpa: "", year: "" })} className="bg-blue-500 text-white px-4 py-2 rounded">Add Education</button>

          <h3 className="text-lg font-semibold">Experience</h3>
          {formData.experience.map((exp, index) => (
            <div key={index} className="space-y-2 border p-2 rounded">
              <input type="text" name="company" placeholder="Company" value={exp.company} onChange={(e) => handleChange(e, index, "experience")} className="w-full p-2 border rounded" />
              <input type="text" name="role" placeholder="Role" value={exp.role} onChange={(e) => handleChange(e, index, "experience")} className="w-full p-2 border rounded" />
              <button type="button" onClick={() => removeField("experience", index)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addField("experience", { company: "", role: "" })} className="bg-blue-500 text-white px-4 py-2 rounded">Add Experience</button>

          <h3 className="text-lg font-semibold">Skills</h3>
          {formData.skills.map((skill, index) => (
            <div key={index} className="space-y-2 border p-2 rounded">
              <input type="text" name="skill" placeholder="Skill" value={skill} onChange={(e) => handleChange(e, index, "skills")} className="w-full p-2 border rounded" />
              <button type="button" onClick={() => removeField("skills", index)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addField("skills", "")} className="bg-blue-500 text-white px-4 py-2 rounded">Add Skill</button>

          <h3 className="text-lg font-semibold">Projects</h3>
          {formData.projects.map((project, index) => (
            <div key={index} className="space-y-2 border p-2 rounded">
              <input type="text" name="name" placeholder="Project Name" value={project.name} onChange={(e) => handleChange(e, index, "projects")} className="w-full p-2 border rounded" />
              <input type="text" name="techStack" placeholder="Key Skills" value={project.techStack} onChange={(e) => handleChange(e, index, "projects")} className="w-full p-2 border rounded" />
              <textarea name="description" placeholder="Description" value={project.description} onChange={(e) => handleChange(e, index, "projects")} className="w-full p-2 border rounded"></textarea>
              <button type="button" onClick={() => removeField("projects", index)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addField("projects", { name: "", techStack: "", description: "" })} className="bg-blue-500 text-white px-4 py-2 rounded">Add Project</button>

          <h3 className="text-lg font-semibold">Certifications</h3>
          {formData.certifications.map((cert, index) => (
            <div key={index} className="space-y-2 border p-2 rounded">
              <input type="text" name="title" placeholder="Certificate Title" value={cert.title} onChange={(e) => handleChange(e, index, "certifications")} className="w-full p-2 border rounded" />
              <input type="text" name="company" placeholder="Issued By" value={cert.company} onChange={(e) => handleChange(e, index, "certifications")} className="w-full p-2 border rounded" />
              <input type="text" name="skills" placeholder="Skills Gained" value={cert.skills} onChange={(e) => handleChange(e, index, "certifications")} className="w-full p-2 border rounded" />
              <button type="button" onClick={() => removeField("certifications", index)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addField("certifications", { title: "", company: "", skills: "" })} className="bg-blue-500 text-white px-4 py-2 rounded">Add Certification</button>

          <h3 className="text-lg font-semibold">Languages Known</h3>
          {formData.languagesKnown.map((lang, index) => (
            <div key={index} className="space-y-2 border p-2 rounded">
              <input type="text" name="language" placeholder="Language" value={lang} onChange={(e) => handleChange(e, index, "languagesKnown")} className="w-full p-2 border rounded" />
              <button type="button" onClick={() => removeField("languagesKnown", index)} className="text-red-500">Remove</button>
            </div>
          ))}
          <button type="button" onClick={() => addField("languagesKnown", "")} className="bg-blue-500 text-white px-4 py-2 rounded">Add Language</button>
        </form>
      </div>

      <div className="flex space-x-4 mt-4">
        <button onClick={() => handlePreview('preview')} className="bg-blue-500 text-white px-4 py-2 rounded">Preview</button>
        <button onClick={() => handlePreview('share')} className="bg-purple-500 text-white px-4 py-2 rounded">Share</button>
        <button onClick={handleDownloadPDF} className="bg-red-500 text-white px-4 py-2 rounded">Download PDF</button>
      </div>

      <div ref={resumeRef} style={{ display: "none" }}>
        <div className="resume-container">
          <div className="resume-header">
            {formData.photo && <img src={formData.photo} alt="Profile Photo" className="resume-photo" />}
            <div>
              <div className="resume-name">{formData.name}</div>
              <div className="resume-contact">
                <p>{formData.phone} | {formData.email}</p>
              </div>
            </div>
          </div>
          <div className="resume-section">
            <h3>Objective</h3>
            <p>{formData.objective}</p>
          </div>
          <div className="resume-section">
            <h3>Education</h3>
            {formData.education.map((edu, index) => (
              <div key={index}>
                <p><strong>{edu.college}</strong></p>
                <p><strong>Degree:</strong> {edu.degree} – <strong>CGPA:</strong> {edu.cgpa} – <strong>Year:</strong> {edu.year}</p>
              </div>
            ))}
          </div>
          <div className="resume-section">
            <h3>Experience</h3>
            {formData.experience.map((exp, index) => (
              <div key={index}>
                <p><strong>Company:</strong> {exp.company}</p>
                <p><strong>Role:</strong> {exp.role}</p>
              </div>
            ))}
          </div>
          <div className="resume-section">
            <h3>Skills</h3>
            {formData.skills.map((skill, index) => (
              <p key={index}>{skill}</p>
            ))}
          </div>
          <div className="resume-section">
            <h3>Projects</h3>
            {formData.projects.map((proj, index) => (
              <div key={index}>
                <p><strong>Name:</strong> {proj.name}</p>
                <p><strong>Tech Stack:</strong> {proj.techStack}</p>
                <p><strong>Description:</strong> {proj.description}</p>
              </div>
            ))}
          </div>
          <div className="resume-section">
            <h3>Certifications</h3>
            {formData.certifications.map((cert, index) => (
              <div key={index}>
                <p><strong>Title:</strong> {cert.title}</p>
                <p><strong>Company:</strong> {cert.company}</p>
                <p><strong>Skills:</strong> {cert.skills}</p>
              </div>
            ))}
          </div>
          <div className="resume-section">
            <h3>Languages Known</h3>
            {formData.languagesKnown.map((lang, index) => (
              <p key={index}>{lang}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeMaker;
