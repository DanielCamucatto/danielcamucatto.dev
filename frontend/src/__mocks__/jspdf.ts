// Mock para jsPDF
export default class jsPDF {
  constructor() {}
  
  text() {
    return this;
  }
  
  setFontSize() {
    return this;
  }
  
  setFont() {
    return this;
  }
  
  addPage() {
    return this;
  }
  
  save() {
    return this;
  }
  
  internal = {
    pageSize: {
      getWidth: () => 210,
      getHeight: () => 297
    }
  };
}