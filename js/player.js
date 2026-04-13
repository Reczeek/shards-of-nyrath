function createPlayer(cls) {
    return {
        classId: cls.id,
        className: cls.name,
        classIcon: cls.icon,
        hp: 50 + cls.stats.vit * 5,
        maxHp: 50 + cls.stats.vit * 5,
        stats: { ...cls.stats },
        level: 1,
        xp: 0,
        xpToNext: 100,
        gold: 0,
        statPoints: 0,
        equipment: { weapon: null, armor: null, accessory: null },
        blessings: [],
        usedDeathDefiance: false
    };
}