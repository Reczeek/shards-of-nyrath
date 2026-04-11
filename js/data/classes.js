const CLASSES = [
    {
        id: 'war',
        name: 'Aspekt Wojny',
        icon: '⚔️',
        description: 'Byłeś bogiem konfliktu. Silny, brutalny, niezniszczalny.',
        stats: { vit: 14, str: 12, def: 8, agi: 6, int: 4 },
        unlocked: true
    },
    {
        id: 'dark',
        name: 'Aspekt Mroku',
        icon: '🌑',
        description: 'Pamiętasz cień który rzucałeś na Nyrath. Przekleństwa, mrok, kradzież życia.',
        stats: { vit: 8, str: 8, def: 6, agi: 10, int: 12 },
        unlocked: true
    },
    {
        id: 'storm',
        name: 'Aspekt Burzy',
        icon: '⚡',
        description: 'Chaos i prędkość. Błyskawice, wielokrotne ataki, elektryczna furia.',
        stats: { vit: 8, str: 10, def: 4, agi: 14, int: 8 },
        unlocked: false
    },
    {
        id: 'time',
        name: 'Aspekt Czasu',
        icon: '⏳',
        description: 'Manipulujesz turami, spowalniasz wrogów, cofasz akcje.',
        stats: { vit: 8, str: 6, def: 8, agi: 12, int: 10 },
        unlocked: false
    },
    {
        id: 'blood',
        name: 'Aspekt Krwi',
        icon: '🩸',
        description: 'Im mniej HP tym mocniejszy. Ryzyko jest Twoją siłą.',
        stats: { vit: 10, str: 14, def: 4, agi: 8, int: 8 },
        unlocked: false
    },
    {
        id: 'death',
        name: 'Aspekt Śmierci',
        icon: '💀',
        description: 'Wskrzeszasz wrogów jako sojuszników. Nekromancja i przekleństwa.',
        stats: { vit: 8, str: 8, def: 6, agi: 8, int: 14 },
        unlocked: false
    },
    {
        id: 'life',
        name: 'Aspekt Życia',
        icon: '🌿',
        description: 'Regeneracja, tarcze, leczenie. Trudno Cię zabić.',
        stats: { vit: 16, str: 6, def: 10, agi: 6, int: 6 },
        unlocked: false
    }
];