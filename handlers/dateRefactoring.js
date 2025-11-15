export const formatDate = (date) => {
  if (!date) return '—';
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

export function parseDateDDMMYYYY(str) {
  const parts = str.split('.');
  if (parts.length !== 3) return null;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // ← вычитаем 1, потому что месяцы с 0
  const year = parseInt(parts[2], 10);

  // Проверяем корректность даты (например, 32.01.2025 — невалидно)
  const date = new Date(year, month, day);
  if (
    date.getFullYear() === year &&
    date.getMonth() === month &&
    date.getDate() === day
  ) {
    return date;
  }

  return null; // некорректная дата
}