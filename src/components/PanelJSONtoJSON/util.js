export const labelColorForType = (type) => {
  try {
    let color = 'bg-gray-700';
    if (type === 'String') color = 'bg-green-700';
    if (type === 'Object') color = 'bg-indigo-700';
    if (type === 'Array') color = 'bg-yellow-700';
    return color;
  } catch(e) {
    return 'bg-gray-700';
  }
};

export const bgColorForType = (type) => {
  try {
    let color = 'bg-gray-900';
    if (type === 'String') color = 'bg-green-900';
    if (type === 'Object') color = 'bg-indigo-900';
    if (type === 'Array') color = 'bg-yellow-900';
    return color;
  } catch(e) {
    return 'bg-gray-900';
  }
};