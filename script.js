// ==================== DADOS INICIAIS ====================
let currentUser = null;
let users = [
    {
        id: 1,
        name: "Maria Silva",
        email: "maria@email.com",
        phone: "(11) 99999-1234",
        password: "123456",
        joinDate: new Date('2024-01-15')
    },
    {
        id: 2,
        name: "João Santos",
        email: "joao@email.com",
        phone: "(11) 98888-5678",
        password: "123456",
        joinDate: new Date('2024-02-10')
    }
];

let pets = [
    {
        id: 1,
        ownerId: 1,
        name: "Luna",
        species: "dog",
        breed: "Labrador",
        age: "young",
        size: "large",
        gender: "female",
        type: "adoption",
        status: "available", // 'available', 'adopted'
        description: "Luna é uma cadela muito carinhosa e brincalhona. Adora crianças e outros animais. Está castrada e com vacinas em dia.",
        createdAt: new Date('2024-03-01'),
        photo: null,
        vaccines: [
            {
                id: 1,
                name: "V10",
                date: new Date('2024-01-15'),
                nextDate: new Date('2025-01-15'),
                vet: "Dr. Carlos - Clínica Vida Animal",
                notes: "Primeira dose anual"
            }
        ]
    },
    {
        id: 2,
        ownerId: 2,
        name: "Mimi",
        species: "cat",
        breed: "Siamês",
        age: "adult",
        size: "small",
        gender: "female",
        type: "adoption",
        status: "available",
        description: "Gata muito tranquila e independente. Perfeita para apartamentos. Gosta de carinho mas respeita o espaço.",
        createdAt: new Date('2024-03-05'),
        photo: null,
        vaccines: []
    },
    {
        id: 3,
        ownerId: 1,
        name: "Rex",
        species: "dog",
        breed: "Pastor Alemão",
        age: "adult",
        size: "large",
        gender: "male",
        type: "personal",
        status: "personal",
        description: "Cão de guarda muito leal e protetor. Bem treinado e obediente.",
        createdAt: new Date('2024-02-20'),
        photo: null,
        vaccines: [
            {
                id: 2,
                name: "Antirrábica",
                date: new Date('2024-02-01'),
                nextDate: new Date('2025-02-01'),
                vet: "Dra. Ana - Pet Center",
                notes: "Vacina obrigatória"
            }
        ]
    }
];

let nextUserId = 3;
let nextPetId = 4;
let nextVaccineId = 3;

// ==================== UTILITÁRIOS ====================
function showMessage(elementId, message, type = 'success') {
    const messageEl = document.getElementById(elementId);
    messageEl.textContent = message;
    messageEl.className = `message ${type} active`;
    setTimeout(() => {
        messageEl.classList.remove('active');
    }, 5000);
}

function formatDate(date) {
    return date.toLocaleDateString('pt-BR');
}

function getSpeciesIcon(species) {
    const icons = {
        dog: '🐕',
        cat: '🐱',
    };
    return icons[species] || '🐾';
}

function getAgeLabel(age) {
    const labels = {
        puppy: 'Filhote',
        young: 'Jovem',
        adult: 'Adulto',
        senior: 'Idoso'
    };
    return labels[age] || age;
}

function getSizeLabel(size) {
    const labels = {
        small: 'Pequeno',
        medium: 'Médio',
        large: 'Grande'
    };
    return labels[size] || size;
}

function getGenderLabel(gender) {
    return gender === 'male' ? 'Macho' : 'Fêmea';
}

// ==================== NAVEGAÇÃO ====================
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }

    const clickedBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => {
        const onclick = btn.getAttribute('onclick');
        return onclick && onclick.includes(`'${pageId}'`);
    });
    if (clickedBtn) {
        clickedBtn.classList.add('active');
    }

    if (pageId === 'adoption') {
        loadAdoptionPets();
    } else if (pageId === 'my-pets') {
        loadMyPets();
    }
}

function updateAuthButtons() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const myPetsBtn = document.getElementById('myPetsBtn');
    const userInfo = document.getElementById('userInfo');
    const userName = document.getElementById('userName');

    if (currentUser) {
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
        myPetsBtn.style.display = 'inline-block';
        userInfo.classList.add('active');
        userName.textContent = currentUser.name;
    } else {
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
        myPetsBtn.style.display = 'none';
        userInfo.classList.remove('active');
    }
}

// ==================== AUTENTICAÇÃO ====================
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!email || !password) {
        showMessage('loginMessage', 'Por favor, preencha todos os campos.', 'error');
        return;
    }

    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        currentUser = user;
        showMessage('loginMessage', `Bem-vindo(a), ${user.name}!`, 'success');
        updateAuthButtons();
        setTimeout(() => showPage('landing'), 1500);
        document.getElementById('loginForm').reset();
    } else {
        showMessage('loginMessage', 'Email ou senha incorretos.', 'error');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const name = document.getElementById('registerName').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const phone = document.getElementById('registerPhone').value.trim();
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;

    if (!name || !email || !phone || !password || !confirmPassword) {
        showMessage('registerMessage', 'Por favor, preencha todos os campos.', 'error');
        return;
    }

    if (password !== confirmPassword) {
        showMessage('registerMessage', 'As senhas não coincidem.', 'error');
        return;
    }

    if (password.length < 6) {
        showMessage('registerMessage', 'A senha deve ter pelo menos 6 caracteres.', 'error');
        return;
    }

    if (users.some(u => u.email === email)) {
        showMessage('registerMessage', 'Este email já está cadastrado.', 'error');
        return;
    }

    const newUser = {
        id: nextUserId++,
        name,
        email,
        phone,
        password,
        joinDate: new Date()
    };

    users.push(newUser);
    showMessage('registerMessage', 'Cadastro realizado com sucesso!', 'success');
    document.getElementById('registerForm').reset();
    setTimeout(() => showPage('login'), 2000);
}

function logout() {
    currentUser = null;
    updateAuthButtons();
    showPage('landing');
}

// ==================== PETS ====================
function handlePetRegistration(event) {
    event.preventDefault();
    
    if (!currentUser) {
        alert('Você precisa estar logado para cadastrar um pet.');
        showPage('login');
        return;
    }

    const formData = new FormData(event.target);
    const petData = Object.fromEntries(formData);
    const photoFile = document.getElementById('petPhoto').files[0];
    let photoURL = null;

    if (photoFile) {
        photoURL = URL.createObjectURL(photoFile);
    }

    if (!petData.name || !petData.type || !petData.species || !petData.breed || 
        !petData.age || !petData.size || !petData.gender || !petData.description) {
        showMessage('petRegisterMessage', 'Por favor, preencha todos os campos.', 'error');
        return;
    }

    const newPet = {
        id: nextPetId++,
        ownerId: currentUser.id,
        name: petData.name,
        species: petData.species,
        breed: petData.breed,
        age: petData.age,
        size: petData.size,
        gender: petData.gender,
        type: petData.type,
        status: petData.type === 'adoption' ? 'available' : 'personal',
        description: petData.description,
        createdAt: new Date(),
        photo: photoURL,
        vaccines: []
    };

    pets.push(newPet);
    showMessage('petRegisterMessage', `${petData.name} foi cadastrado com sucesso!`, 'success');
    document.getElementById('petRegisterForm').reset();
    
    setTimeout(() => {
        if (petData.type === 'adoption') {
            showPage('adoption');
        } else {
            showPage('my-pets');
        }
    }, 2000);
}

function loadAdoptionPets() {
    const container = document.getElementById('adoptionPets');
    const adoptionPets = pets.filter(pet => pet.type === 'adoption' && pet.status === 'available');

    if (adoptionPets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🐾</div>
                <h3>Nenhum pet disponível</h3>
                <p>No momento, não há pets para adoção. Volte em breve!</p>
            </div>
        `;
        return;
    }

    displayPets(adoptionPets, container, true);
}

function loadMyPets() {
    if (!currentUser) {
        showPage('login');
        return;
    }

    const container = document.getElementById('myPetsGrid');
    const myPets = pets.filter(pet => pet.ownerId === currentUser.id);

    if (myPets.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🐾</div>
                <h3>Você ainda não tem pets cadastrados</h3>
                <p>Cadastre seu primeiro pet para começar a usar a carteira de vacinação digital.</p>
                <button class="btn" onclick="showPage('pet-register')" style="width: auto; padding: 15px 30px;">
                    Cadastrar Meu Primeiro Pet
                </button>
            </div>
        `;
        return;
    }

    displayPets(myPets, container, false);
}
    
function getStatusIndicator(pet) {
    if (pet.type === 'personal') {
        return `<span class="status-indicator status-personal">👤 Meu Pet</span>`;
    } else if (pet.status === 'available') {
        return `<span class="status-indicator status-available">🏠 Disponível</span>`;
    } else if (pet.status === 'adopted') {
        return `<span class="status-indicator status-adopted">❤️ Adotado</span>`;
    }
    return '';
}

function displayPets(petsToShow, container, isAdoptionView) {
    container.innerHTML = petsToShow.map(pet => {
        const owner = users.find(u => u.id === pet.ownerId);
        const upcomingVaccines = getUpcomingVaccines(pet);
        const petImage = pet.photo ? `<img src="${pet.photo}" alt="Foto de ${pet.name}">` : getSpeciesIcon(pet.species);
        
        let actionButtons = '';
        if (isAdoptionView) {
            actionButtons = `
                <button class="btn btn-small" onclick="openPetProfile(${pet.id})">Ver Perfil</button>
                <button class="btn btn-small" onclick="showContact(${pet.ownerId})" style="background: #38a169;">Contato</button>
            `;
        } else { // My Pets View
            actionButtons = `<button class="btn btn-small" onclick="openPetProfile(${pet.id})">Ver Perfil</button>`;
            if (pet.type === 'personal') {
                actionButtons += `<button class="btn btn-small" onclick="openVaccinationModal(${pet.id})" style="background: #ed8936;">+ Vacina</button>`;
            } else if (pet.type === 'adoption' && pet.status === 'available') {
                actionButtons += `<button class="btn btn-small" onclick="markAsAdopted(${pet.id})" style="background: #38a169;">Marcar como Adotado</button>`;
            }
        }

        return `
            <div class="pet-card">
                <div class="pet-image">
                    ${petImage}
                </div>
                <div class="pet-info">
                    <div class="pet-name">${pet.name}</div>
                    <div class="pet-details">
                        <div class="pet-detail-item">
                            <span>Espécie:</span>
                            <span>${getSpeciesIcon(pet.species)} ${pet.species === 'dog' ? 'Cão' : pet.species === 'cat' ? 'Gato' : pet.species}</span>
                        </div>
                        <div class="pet-detail-item">
                            <span>Idade:</span>
                            <span>${getAgeLabel(pet.age)}</span>
                        </div>
                        <div class="pet-detail-item">
                            <span>Porte:</span>
                            <span>${getSizeLabel(pet.size)}</span>
                        </div>
                    </div>
                    <div class="pet-description">${pet.description}</div>
                    ${upcomingVaccines.length > 0 ? 
                        `<div style="background: #fff8e1; padding: 10px; border-radius: 8px; margin-bottom: 15px; border-left: 3px solid #ed8936;">
                            <small style="color: #ed8936; font-weight: 600;">⚠️ ${upcomingVaccines.length} vacina(s) próxima(s) do vencimento</small>
                        </div>` : ''
                    }
                    <div class="pet-actions">${actionButtons}</div>
                    <div style="margin-top: 10px;">${getStatusIndicator(pet)}</div>
                </div>
            </div>
        `;
    }).join('');
}
    
function markAsAdopted(petId) {
    if (confirm("Você tem certeza que deseja marcar este pet como adotado? Esta ação removerá o pet da lista pública de adoção.")) {
        const pet = pets.find(p => p.id === petId);
        if (pet) {
            pet.status = 'adopted';
            loadMyPets(); // Refresh the "My Pets" view to show the updated status
        }
    }
}

function filterPets() {
    const search = document.getElementById('searchFilter')?.value.toLowerCase() || '';
    const species = document.getElementById('speciesFilter')?.value || '';
    const size = document.getElementById('sizeFilter')?.value || '';
    const age = document.getElementById('ageFilter')?.value || '';

    const adoptionPets = pets.filter(pet => pet.type === 'adoption' && pet.status === 'available');
    
    const filtered = adoptionPets.filter(pet => {
        const matchesSearch = !search || 
            pet.name.toLowerCase().includes(search) || 
            pet.breed.toLowerCase().includes(search);
        const matchesSpecies = !species || pet.species === species;
        const matchesSize = !size || pet.size === size;
        const matchesAge = !age || pet.age === age;

        return matchesSearch && matchesSpecies && matchesSize && matchesAge;
    });

    const container = document.getElementById('adoptionPets');
    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🔍</div>
                <h3>Nenhum pet encontrado</h3>
                <p>Tente ajustar os filtros de busca.</p>
                <button class="btn" onclick="clearFilters()" style="width: auto; padding: 15px 30px;">
                    Limpar Filtros
                </button>
            </div>
        `;
    } else {
        displayPets(filtered, container, true);
    }
}

function clearFilters() {
    document.getElementById('searchFilter').value = '';
    document.getElementById('speciesFilter').value = '';
    document.getElementById('sizeFilter').value = '';
    document.getElementById('ageFilter').value = '';
    loadAdoptionPets();
}

// ==================== MODAIS ====================
function openPetProfile(petId) {
    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    const owner = users.find(u => u.id === pet.ownerId);
    const isOwner = currentUser && currentUser.id === pet.ownerId;
    const upcomingVaccines = getUpcomingVaccines(pet);
    const petImage = pet.photo ? `<img src="${pet.photo}" alt="Foto de ${pet.name}" style="width: 100%; height: 100%; object-fit: cover;">` : getSpeciesIcon(pet.species);

    let adoptionButton = '';
    if (pet.type === 'adoption' && pet.status === 'available' && !isOwner) {
        adoptionButton = `
            <div style="text-align: center; margin-top: 25px;">
                <button class="btn" onclick="showContact(${pet.ownerId})" style="background: #38a169; width: auto; padding: 15px 30px;">
                    💬 Entrar em Contato para Adoção
                </button>
            </div>
        `;
    } else if (isOwner && pet.type === 'adoption' && pet.status === 'available') {
         adoptionButton = `
            <div style="text-align: center; margin-top: 25px;">
                <button class="btn" onclick="markAsAdopted(${pet.id})" style="background: #38a169; width: auto; padding: 15px 30px;">
                    Marcar como Adotado
                </button>
            </div>
        `;
    }

    document.getElementById('petModalContent').innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 5rem; margin-bottom: 15px; width: 150px; height: 150px; border-radius: 50%; overflow: hidden; margin: 0 auto; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
                ${petImage}
            </div>
            <h2 style="color: #2d3748; margin-bottom: 10px;">${pet.name}</h2>
            <p style="color: #718096;">Cadastrado em ${formatDate(pet.createdAt)}</p>
            ${getStatusIndicator(pet)}
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; margin-bottom: 25px;">
            <div style="text-align: center; padding: 15px; background: #f7fafc; border-radius: 10px;">
                <div style="font-weight: 600; color: #4a5568; font-size: 0.9rem;">ESPÉCIE</div>
                <div style="color: #2d3748; font-weight: 700;">${pet.species === 'dog' ? 'Cão' : pet.species === 'cat' ? 'Gato' : pet.species}</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f7fafc; border-radius: 10px;">
                <div style="font-weight: 600; color: #4a5568; font-size: 0.9rem;">RAÇA</div>
                <div style="color: #2d3748; font-weight: 700;">${pet.breed}</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f7fafc; border-radius: 10px;">
                <div style="font-weight: 600; color: #4a5568; font-size: 0.9rem;">IDADE</div>
                <div style="color: #2d3748; font-weight: 700;">${getAgeLabel(pet.age)}</div>
            </div>
        </div>

        <div style="margin-bottom: 25px;">
            <h4 style="color: #2d3748; margin-bottom: 10px; font-size: 1.1rem;">📝 Sobre ${pet.name}</h4>
            <p style="color: #4a5568; line-height: 1.6; background: #f7fafc; padding: 15px; border-radius: 10px;">${pet.description}</p>
        </div>

        <div class="vaccination-section">
            <div class="vaccination-header">
                <h3>💉 Carteira de Vacinação</h3>
                ${isOwner ? `<button class="btn btn-small" onclick="openVaccinationModal(${pet.id})">+ Adicionar Vacina</button>` : ''}
            </div>
            <div class="vaccination-list">
                ${pet.vaccines.length > 0 ? pet.vaccines.map(vaccine => `
                    <div class="vaccination-item ${isVaccineUpcoming(vaccine) ? 'upcoming' : ''}">
                        <div class="vaccination-info">
                            <h4>💉 ${vaccine.name}</h4>
                            <p>Aplicada em ${formatDate(vaccine.date)}</p>
                        </div>
                        <div class="vaccination-date ${isVaccineUpcoming(vaccine) ? 'upcoming' : ''}">
                            ${vaccine.nextDate ? `Próxima: ${formatDate(vaccine.nextDate)}` : 'Dose única'}
                        </div>
                    </div>
                `).join('') : `
                    <div style="text-align: center; padding: 40px; color: #718096;">
                        Nenhuma vacina registrada.
                    </div>
                `}
            </div>
        </div>
        ${adoptionButton}
    `;

    document.getElementById('petModal').classList.add('active');
}

function closePetModal() {
    document.getElementById('petModal').classList.remove('active');
}

function openVaccinationModal(petId) {
    document.getElementById('vaccinePetId').value = petId;
    document.getElementById('vaccinationForm').reset();
    document.getElementById('vaccinationModal').classList.add('active');
}

function closeVaccinationModal() {
    document.getElementById('vaccinationModal').classList.remove('active');
}

function handleVaccination(event) {
    event.preventDefault();
    
    const petId = parseInt(document.getElementById('vaccinePetId').value);
    const name = document.getElementById('vaccineName').value.trim();
    const date = document.getElementById('vaccineDate').value;
    const nextDate = document.getElementById('vaccineNext').value;
    const vet = document.getElementById('vaccineVet').value.trim();
    const notes = document.getElementById('vaccineNotes').value.trim();

    if (!name || !date) {
        alert('Por favor, preencha os campos obrigatórios.');
        return;
    }

    const pet = pets.find(p => p.id === petId);
    if (!pet) return;

    const newVaccine = {
        id: nextVaccineId++,
        name,
        date: new Date(date),
        nextDate: nextDate ? new Date(nextDate) : null,
        vet: vet || null,
        notes: notes || null
    };

    pet.vaccines.push(newVaccine);
    closeVaccinationModal();
    openPetProfile(petId);
    
    if (document.getElementById('my-pets').classList.contains('active')) {
        loadMyPets();
    }
}

function showContact(ownerId) {
    const owner = users.find(u => u.id === ownerId);
    if (!owner) return;

    document.getElementById('contactModalContent').innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 4rem; margin-bottom: 15px;">👤</div>
            <h3 style="color: #2d3748; margin-bottom: 5px;">${owner.name}</h3>
            <p style="color: #718096;">Responsável pelo pet</p>
        </div>
        <div style="background: #f7fafc; border-radius: 10px; padding: 25px; margin-bottom: 25px;">
            <h4 style="color: #2d3748; margin-bottom: 15px;">📞 Informações de Contato</h4>
            <div style="margin-bottom: 15px;">
                <strong style="color: #4a5568;">Email:</strong>
                <a href="mailto:${owner.email}" style="color: #667eea; text-decoration: none; margin-left: 10px;">${owner.email}</a>
            </div>
            <div>
                <strong style="color: #4a5568;">Telefone:</strong>
                <a href="tel:${owner.phone}" style="color: #667eea; text-decoration: none; margin-left: 10px;">${owner.phone}</a>
            </div>
        </div>
    `;

    document.getElementById('contactModal').classList.add('active');
}

function closeContactModal() {
    document.getElementById('contactModal').classList.remove('active');
}

// ==================== VACINAS UTILITÁRIOS ====================
function getUpcomingVaccines(pet) {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return pet.vaccines.filter(vaccine => {
        if (!vaccine.nextDate) return false;
        const nextDate = new Date(vaccine.nextDate);
        return nextDate >= today && nextDate <= thirtyDaysFromNow;
    });
}

function isVaccineUpcoming(vaccine) {
    if (!vaccine.nextDate) return false;
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    const nextDate = new Date(vaccine.nextDate);
    return nextDate >= today && nextDate <= thirtyDaysFromNow;
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
    document.getElementById('registerForm').addEventListener('submit', handleRegister);
    document.getElementById('petRegisterForm').addEventListener('submit', handlePetRegistration);
    document.getElementById('vaccinationForm').addEventListener('submit', handleVaccination);

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });

    updateAuthButtons();
    loadAdoptionPets();
    
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('vaccineDate').max = today;
});

// ==================== INICIALIZAÇÃO ====================
updateAuthButtons();