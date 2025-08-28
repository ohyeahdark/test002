import * as React from 'react';
import { getLeaveTypes, type LeaveType } from './leaveAPI';

export function useLeaveTypes(when = true) {
  const [types, setTypes] = React.useState<LeaveType[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!when) return;
    setLoading(true);
    setError(null);
    getLeaveTypes()
      .then(setTypes)
      .catch((e: any) => setError(e?.response?.data?.message || String(e)))
      .finally(() => setLoading(false));
  }, [when]);

  return { types, loading, error, reload: () => getLeaveTypes().then(setTypes) };
}
