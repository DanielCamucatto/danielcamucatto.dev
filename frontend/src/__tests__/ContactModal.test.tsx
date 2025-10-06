import { render, screen, fireEvent } from '../utils/test/render-utils';
import ContactModal from '../components/ContactModal';
import ContactForm from '../components/ContactForm';

describe('ContactModal', () => {
  it('renderiza o modal quando open é true', () => {
    render(
      <ContactModal open={true} onClose={() => {}}>
        <h2>Entre em contato</h2>
        <ContactForm />
      </ContactModal>
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText(/entre em contato/i)).toBeInTheDocument();
  });

  it('não renderiza o modal quando open é false', () => {
    render(
      <ContactModal open={false} onClose={() => {}}>
        <ContactForm />
      </ContactModal>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('fecha o modal ao clicar no botão X', () => {
    const onClose = jest.fn();
    render(
      <ContactModal open={true} onClose={onClose}>
        <ContactForm />
      </ContactModal>
    );
    
    const closeButton = screen.getByLabelText(/fechar/i);
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('fecha o modal ao pressionar Escape', () => {
    const onClose = jest.fn();
    render(
      <ContactModal open={true} onClose={onClose}>
        <ContactForm />
      </ContactModal>
    );
    
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('não fecha ao pressionar outras teclas', () => {
    const onClose = jest.fn();
    render(
      <ContactModal open={true} onClose={onClose}>
        <ContactForm />
      </ContactModal>
    );
    
    fireEvent.keyDown(screen.getByRole('dialog'), { key: 'Enter' });
    
    expect(onClose).not.toHaveBeenCalled();
  });
});
