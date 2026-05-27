// Aura Studio - Interatividade da Landing Page

document.addEventListener('DOMContentLoaded', () => {
    // 1. Efeito de Scroll no Header
    const header = document.querySelector('.header');
    
    const handleScroll = () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Executa uma vez para caso a página já inicie com scroll
    handleScroll();

    // 2. Menu Mobile (Drawer)
    const mobileNavToggle = document.getElementById('mobileNavToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            
            // Troca o ícone de abrir/fechar (se lucide estiver carregado)
            const icon = mobileNavToggle.querySelector('i');
            if (icon && window.lucide) {
                const isOpened = navMenu.classList.contains('active');
                icon.setAttribute('data-lucide', isOpened ? 'x' : 'menu');
                lucide.createIcons(); // Recria os ícones lucide
            }
        });
        
        // Fecha o menu ao clicar em qualquer link
        const navLinks = navMenu.querySelectorAll('a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                const icon = mobileNavToggle.querySelector('i');
                if (icon && window.lucide) {
                    icon.setAttribute('data-lucide', 'menu');
                    lucide.createIcons();
                }
            });
        });
    }

    // 3. Link Ativo no Scroll (Navegação Ativa)
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a');
    
    window.addEventListener('scroll', () => {
        let scrollY = window.pageYOffset;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100; // Offset do header
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    // 4. Alternância de Abas nos Serviços
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');

            // Remove classe ativa de todos os botões e abas
            tabBtns.forEach(b => b.classList.remove('active'));
            tabContents.forEach(c => c.classList.remove('active'));

            // Adiciona classe ativa na aba selecionada
            btn.classList.add('active');
            const activeContent = document.getElementById(targetTab);
            if (activeContent) {
                activeContent.classList.add('active');
            }
        });
    });

    // 5. Lógica da Calculadora de Combos
    const checkboxes = document.querySelectorAll('input[name="service-select"]');
    const selectedServicesList = document.getElementById('selectedServicesList');
    const calcSubtotal = document.getElementById('calcSubtotal');
    const calcDiscount = document.getElementById('calcDiscount');
    const calcTotal = document.getElementById('calcTotal');
    const discountRow = document.getElementById('discountRow');
    const discountLabel = document.getElementById('discountLabel');
    const discountBadgeInfo = document.getElementById('discountBadgeInfo');
    const btnBookCombo = document.getElementById('btnBookCombo');

    // Mapeamento dos botões "+ Adicionar ao Combo"
    const addComboBtns = document.querySelectorAll('.add-to-combo-btn');

    const updateCalculator = () => {
        let subtotal = 0;
        let selectedCount = 0;
        const selectedItems = [];

        checkboxes.forEach(checkbox => {
            if (checkbox.checked) {
                const name = checkbox.getAttribute('data-name');
                const price = parseFloat(checkbox.getAttribute('data-price'));
                const val = checkbox.value;
                
                subtotal += price;
                selectedCount++;
                selectedItems.push({ val, name, price });
            }
        });

        // Limpa a lista
        selectedServicesList.innerHTML = '';

        if (selectedCount === 0) {
            selectedServicesList.innerHTML = `<p class="no-services-message">Nenhum serviço selecionado. Selecione acima para começar a montar o seu dia de beleza!</p>`;
            calcSubtotal.textContent = 'R$ 0,00';
            calcTotal.textContent = 'R$ 0,00';
            discountRow.style.display = 'none';
            btnBookCombo.disabled = true;
            
            discountBadgeInfo.innerHTML = `<i data-lucide="info"></i> Selecione 2 ou mais serviços para ganhar até 15% de desconto!`;
            if (window.lucide) lucide.createIcons();
            return;
        }

        btnBookCombo.disabled = false;

        // Renderiza os itens selecionados (pills)
        selectedItems.forEach(item => {
            const pill = document.createElement('div');
            pill.className = 'selected-service-pill';
            pill.innerHTML = `
                <span>${item.name}</span>
                <div style="display: flex; align-items: center; gap: 0.75rem;">
                    <span>R$ ${item.price.toFixed(2).replace('.', ',')}</span>
                    <button class="remove-item-btn" data-value="${item.val}" aria-label="Remover">
                        <i data-lucide="x"></i>
                    </button>
                </div>
            `;
            selectedServicesList.appendChild(pill);
        });

        // Adiciona eventos nos botões de remoção das pills
        const removeBtns = selectedServicesList.querySelectorAll('.remove-item-btn');
        removeBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                const val = btn.getAttribute('data-value');
                const targetCheckbox = document.querySelector(`input[name="service-select"][value="${val}"]`);
                if (targetCheckbox) {
                    targetCheckbox.checked = false;
                    updateCalculator();
                }
            });
        });

        // Cálculo de desconto progressivo
        let discountPercentage = 0;
        let infoText = '';

        if (selectedCount === 1) {
            discountPercentage = 0;
            infoText = `<i data-lucide="info"></i> Adicione mais 1 serviço para ganhar 10% de desconto!`;
        } else if (selectedCount === 2) {
            discountPercentage = 0.10;
            infoText = `<i data-lucide="sparkles"></i> Parabéns! Você ganhou 10% de desconto. Adicione +1 para ganhar 15%!`;
        } else {
            discountPercentage = 0.15;
            infoText = `<i data-lucide="sparkles"></i> Incrível! Você liberou o desconto máximo de 15% do Aura Combo!`;
        }

        const discountValue = subtotal * discountPercentage;
        const total = subtotal - discountValue;

        // Atualiza a tela
        calcSubtotal.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
        
        if (discountPercentage > 0) {
            discountRow.style.display = 'flex';
            discountLabel.textContent = `Desconto (${discountPercentage * 100}%)`;
            calcDiscount.textContent = `- R$ ${discountValue.toFixed(2).replace('.', ',')}`;
        } else {
            discountRow.style.display = 'none';
        }

        calcTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
        discountBadgeInfo.innerHTML = infoText;

        if (window.lucide) {
            lucide.createIcons();
        }
    };

    // Ouvinte para cada checkbox na calculadora
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', updateCalculator);
    });

    // Ouvinte para botões de adicionar ao combo na grade de serviços
    addComboBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const serviceId = btn.getAttribute('data-service-id');
            const targetCheckbox = document.querySelector(`input[name="service-select"][value="${serviceId}"]`);
            
            if (targetCheckbox) {
                targetCheckbox.checked = true;
                updateCalculator();
                
                // Rola suavemente até a calculadora para mostrar o resultado
                const calcSection = document.getElementById('calculator');
                if (calcSection) {
                    calcSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }
        });
    });

    // Agendar Aura Combo (Ação de clique)
    if (btnBookCombo) {
        btnBookCombo.addEventListener('click', () => {
            const selectedItems = [];
            checkboxes.forEach(cb => {
                if (cb.checked) {
                    selectedItems.push(cb.getAttribute('data-name'));
                }
            });

            const comboMessage = `Olá! Montei meu Aura Combo personalizado no site com: ${selectedItems.join(', ')}. Gostaria de verificar os horários disponíveis!`;
            
            // Redireciona para o formulário de contato (vamos preencher depois)
            const contactMsgArea = document.getElementById('contact-message');
            if (contactMsgArea) {
                contactMsgArea.value = comboMessage;
                const contactSection = document.getElementById('contact');
                if (contactSection) {
                    contactSection.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                // Se o formulário ainda não existir, abre direto no WhatsApp
                const encodedMsg = encodeURIComponent(comboMessage);
                window.open(`https://wa.me/5511999999999?text=${encodedMsg}`, '_blank');
            }
        });
    }

    // 6. Filtros da Galeria
    const filterBtns = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filterValue = btn.getAttribute('data-filter');

            // Atualiza classe ativa nos botões de filtro
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Filtra os itens da galeria com animação
            galleryItems.forEach(item => {
                const category = item.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hide');
                    item.style.animation = 'fadeIn 0.5s ease forwards';
                } else {
                    item.classList.add('hide');
                }
            });
        });
    });

    // 7. Carrossel de Depoimentos
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    let currentSlide = 0;
    let slideInterval;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        slides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    };

    const nextSlide = () => {
        let next = currentSlide + 1;
        if (next >= slides.length) {
            next = 0;
        }
        showSlide(next);
    };

    const startSlideShow = () => {
        slideInterval = setInterval(nextSlide, 5000); // muda a cada 5 segundos
    };

    const resetSlideShow = () => {
        clearInterval(slideInterval);
        startSlideShow();
    };

    if (slides.length > 0 && dots.length > 0) {
        // Inicializa o carrossel
        startSlideShow();

        // Clique nos dots
        dots.forEach(dot => {
            dot.addEventListener('click', () => {
                const targetSlide = parseInt(dot.getAttribute('data-slide'));
                showSlide(targetSlide);
                resetSlideShow();
            });
        });
    }

    // 8. FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            const isActive = faqItem.classList.contains('active');

            // Fecha todos os outros itens FAQ
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Se o item clicado não estava ativo, abre ele
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // 9. Formulário de Contato & Redirecionamento de WhatsApp
    const bookingForm = document.getElementById('bookingForm');
    
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('contact-name').value;
            const phone = document.getElementById('contact-phone').value;
            const date = document.getElementById('contact-date').value;
            const time = document.getElementById('contact-time').value;
            const message = document.getElementById('contact-message').value;

            // Formata a data para pt-BR se estiver selecionada
            let dateFormatted = '';
            if (date) {
                const [year, month, day] = date.split('-');
                dateFormatted = `${day}/${month}/${year}`;
            }

            let appointmentDetails = `Olá! Meu nome é *${name}*.\n`;
            appointmentDetails += `Gostaria de solicitar um agendamento:\n`;
            if (dateFormatted) appointmentDetails += `- *Data*: ${dateFormatted}\n`;
            if (time) appointmentDetails += `- *Hora*: ${time}\n`;
            appointmentDetails += `\n*Serviços/Mensagem*:\n${message}`;

            const encodedMessage = encodeURIComponent(appointmentDetails);
            // Abre o WhatsApp com o texto preenchido (número fictício do salão)
            window.open(`https://wa.me/5521999999999?text=${encodedMessage}`, '_blank');
        });
    }

    // 10. Newsletter Form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input');
            alert(`Obrigado! O e-mail ${emailInput.value} foi cadastrado com sucesso.`);
            emailInput.value = '';
        });
    }
});
