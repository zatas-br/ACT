document.addEventListener('DOMContentLoaded', () => {
  const lang = 'pt-BR';
  const content = siteContent[lang];

  if (content) {
    Object.keys(content).forEach(section => {
      const sectionContent = content[section];
      Object.keys(sectionContent).forEach(key => {
        const element = document.getElementById(`${section}-${key}`);
        if (element) {
          if (Array.isArray(sectionContent[key])) {
            element.innerHTML = sectionContent[key].map(item => `<li>${item}</li>`).join('');
          } else {
            element.innerHTML = sectionContent[key];
          }
        }
      });
    });
  }
});
