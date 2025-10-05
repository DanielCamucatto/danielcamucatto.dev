import { render, screen, fireEvent, waitFor } from '../utils/test/render-utils';
import ContactForm from '../components/ContactForm';

// Mock do fetch
const mockFetch = jest.fn();
globalThis.fetch = mockFetch as typeof fetch;

describe('ContactForm', () => {
  beforeEach(() => {
    mockFetch.mockClear();
  });

  it('renderiza todos os campos do formulário', () => {
    render(<ContactForm />);
    
    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/assunto/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensagem/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar/i })).toBeInTheDocument();
  });

  it('envia formulário com sucesso', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, next: '/thanks' }),
    });

    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/assunto/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/mensagem/i), { target: { value: 'Mensagem de teste' } });
    
    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/sucesso/i)).toBeInTheDocument();
    });
  });

  it('exibe erro ao falhar envio', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Erro no servidor' }),
    });

    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/assunto/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/mensagem/i), { target: { value: 'Mensagem de teste' } });
    
    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/erro/i)).toBeInTheDocument();
    });
  });

  it('chama onClose após envio bem-sucedido', async () => {
    jest.useFakeTimers();
    
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, next: '/thanks' }),
    });

    const onClose = jest.fn();
    render(<ContactForm onClose={onClose} />);
    
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/assunto/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/mensagem/i), { target: { value: 'Mensagem de teste' } });
    
    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByText(/sucesso/i)).toBeInTheDocument();
    });
    
    // Avança 2 segundos (tempo do setTimeout)
    jest.advanceTimersByTime(2000);
    
    expect(onClose).toHaveBeenCalledTimes(1);
    
    jest.useRealTimers();
  });

  it('desabilita botão durante envio', async () => {
    mockFetch.mockImplementationOnce(() => 
      new Promise((resolve) => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ ok: true }),
      }), 1000))
    );

    render(<ContactForm />);
    
    fireEvent.change(screen.getByLabelText(/nome/i), { target: { value: 'João Silva' } });
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'joao@example.com' } });
    fireEvent.change(screen.getByLabelText(/assunto/i), { target: { value: 'Teste' } });
    fireEvent.change(screen.getByLabelText(/mensagem/i), { target: { value: 'Mensagem de teste' } });
    
    const submitButton = screen.getByRole('button', { name: /enviar/i });
    fireEvent.click(submitButton);
    
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /enviando/i })).toBeDisabled();
    });
  });
});
