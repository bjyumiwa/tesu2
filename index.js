function createTile(value) {
    const tile = document.createElement('div');
    tile.classList.add('tile');

    if (value === 0) {
        tile.classList.add('empty'); // 空白タイルにはクラスを追加
    } else {
        tile.textContent = value;
    }

    return tile;
}
