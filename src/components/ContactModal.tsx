import React, { useState } from 'react';
import { X, Mail, Send, CheckCircle2, AlertCircle, Phone, Clock } from 'lucide-react';
import { ContactFormPayload } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDepartment?: string;
}

export const ContactModal: React.FC<ContactModalProps> = ({
  isOpen,
  onClose,
  defaultDepartment = 'Geral / Redação'
}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [department, setDepartment] = useState(defaultDepartment);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [successResult, setSuccessResult] = useState<{ message: string; dispatchId: string; sentAt: string } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    const payload: ContactFormPayload = {
      name,
      email,
      phone,
      department,
      subject,
      message
    };

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Falha ao despachar mensagem para o servidor de e-mails.');
      }

      setSuccessResult({
        message: data.message,
        dispatchId: data.dispatchId,
        sentAt: data.sentAt
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Erro de conexão ao enviar o formulário.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setName('');
    setEmail('');
    setPhone('');
    setSubject('');
    setMessage('');
    setSuccessResult(null);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="bg-white w-full max-w-xl rounded-3xl overflow-hidden shadow-2xl border border-[var(--line)] max-h-[90vh] flex flex-col my-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--line)] bg-[#faf8f5]">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-[#ed003f]" />
            <h2 className="font-serif text-xl font-normal text-[var(--ink)]">
              Fale com a Redação & Atendimento Kurti
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-stone-200 text-[var(--muted)]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 sm:p-8 custom-scrollbar">
          {successResult ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-serif font-normal text-[var(--ink)] mb-2">
                E-mail Enviado com Sucesso!
              </h3>
              <p className="text-xs text-[var(--muted)] max-w-md mx-auto mb-6 leading-relaxed">
                {successResult.message}
              </p>

              <div className="p-4 rounded-xl bg-stone-50 border border-[var(--line)] text-left mb-6 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Identificador de Envio:</span>
                  <strong className="font-mono text-[#ed003f]">{successResult.dispatchId}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Destinatário Oficial:</span>
                  <span>contato@kurti.com.br</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Data e Hora:</span>
                  <span>{new Date(successResult.sentAt).toLocaleString('pt-BR')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[var(--muted)]">Status no Servidor:</span>
                  <span className="text-emerald-700 font-bold">Entregue à fila SMTP de produção</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="px-6 py-2.5 rounded-full bg-[var(--ink)] text-white font-bold text-xs uppercase tracking-wider hover:bg-black transition-colors"
              >
                Concluir e Voltar ao Site
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-[var(--muted)] mb-2 leading-relaxed">
                Envie pautas, sugestões de matérias, dúvidas sobre produtos da loja ou solicitação de orientação jurídica. Respondemos em até 24 horas úteis.
              </p>

              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-[#ed003f]" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1 text-[var(--ink)]">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Como você prefere ser chamado(a)?"
                    className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg focus:outline-hidden focus:border-[#ed003f]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1 text-[var(--ink)]">
                    Seu E-mail *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="seu.email@dominio.com"
                    className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg focus:outline-hidden focus:border-[#ed003f]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold block mb-1 text-[var(--ink)]">
                    Telefone / WhatsApp (opcional)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(00) 00000-0000"
                    className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg focus:outline-hidden focus:border-[#ed003f]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1 text-[var(--ink)]">
                    Departamento
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg bg-white"
                  >
                    <option value="Geral / Redação">Redação & Sugestão de Pauta</option>
                    <option value="Loja e Pedidos">Loja Oficial & Pedidos</option>
                    <option value="Comercial e Parcerias">Publicidade & Parcerias</option>
                    <option value="Denúncias e Apoio Jurídico">Orientação / Denúncias LGBTfobia</option>
                    <option value="Eventos e Cultura">Divulgação de Eventos Culturais</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold block mb-1 text-[var(--ink)]">
                  Assunto da Mensagem *
                </label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="Ex: Sugestão de pauta sobre festival em Belo Horizonte"
                  className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg focus:outline-hidden focus:border-[#ed003f]"
                />
              </div>

              <div>
                <label className="text-xs font-bold block mb-1 text-[var(--ink)]">
                  Mensagem Completa *
                </label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escreva sua mensagem com detalhes..."
                  className="w-full px-3 py-2 text-xs border border-[var(--line)] rounded-lg focus:outline-hidden focus:border-[#ed003f] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-full bg-[#ed003f] hover:bg-[#ba0032] text-white font-bold text-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <span>Enviando e-mail para contato@kurti.com.br...</span>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Enviar Mensagem Agora</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-[11px] text-center text-[var(--muted)] pt-1">
                🔒 Seus dados são confidenciais e protegidos sob a LGPD.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
