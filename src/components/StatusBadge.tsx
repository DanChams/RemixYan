/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ProjectStatus } from '../types.ts';

interface StatusBadgeProps {
  status: ProjectStatus;
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const getColors = () => {
    switch (status) {
      case 'Terminé':
        return 'bg-green-100 text-green-700';
      case 'En cours':
        return 'bg-blue-100 text-blue-700';
      case 'Revu':
        return 'bg-[#f2c391]/20 text-[#c88d4d] border border-[#f2c391]/30';
      case 'Planifié':
        return 'bg-gray-100 text-gray-500';
      case 'Archivé':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase ${getColors()}`}>
      {status}
    </span>
  );
}
