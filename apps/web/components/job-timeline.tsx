'use client';

import { useEffect, useMemo, useState } from 'react';
import type { JobStepStatus, JobTimelineEvent } from '@pharma/shared';

type InitialStep = {
  id: string;
  name: string;
  status: JobStepStatus;
  startedAt: string | null;
  finishedAt: string | null;
};

interface JobTimelineProps {
  jobId: string;
  status: JobStepStatus | 'queued' | 'running' | 'success' | 'failed';
  initialSteps: InitialStep[];
}

interface StepState {
  id: string;
  name: string;
  status: JobStepStatus;
  logs: string[];
  startedAt?: number;
  finishedAt?: number;
}

export default function JobTimeline({ jobId, initialSteps }: JobTimelineProps) {
  const [steps, setSteps] = useState<Record<string, StepState>>(() => {
    const map: Record<string, StepState> = {};
    for (const step of initialSteps) {
      map[step.id] = {
        id: step.id,
        name: step.name,
        status: step.status,
        logs: [],
        startedAt: step.startedAt ? new Date(step.startedAt).getTime() : undefined,
        finishedAt: step.finishedAt ? new Date(step.finishedAt).getTime() : undefined,
      };
    }
    return map;
  });

  useEffect(() => {
    const eventSource = new EventSource(`/api/jobs/${jobId}/stream`);
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data) as JobTimelineEvent & { jobId: string };
        setSteps((prev) => {
          const current = { ...prev };
          const existing = current[data.type === 'job-end' ? '' : (data as any).stepId] as
            | StepState
            | undefined;

          switch (data.type) {
            case 'step-start': {
              current[data.stepId] = {
                id: data.stepId,
                name: data.name,
                status: 'running',
                logs: existing?.logs ?? [],
                startedAt: data.timestamp,
                finishedAt: existing?.finishedAt,
              };
              break;
            }
            case 'step-log': {
              if (!existing) return prev;
              current[data.stepId] = {
                ...existing,
                logs: [...existing.logs, `${new Date(data.timestamp).toLocaleTimeString()} • ${data.message}`],
              };
              break;
            }
            case 'step-end': {
              current[data.stepId] = {
                id: data.stepId,
                name: existing?.name ?? data.stepId,
                status: data.status,
                logs: existing?.logs ?? [],
                startedAt: existing?.startedAt,
                finishedAt: data.timestamp,
              };
              break;
            }
            case 'job-end': {
              break;
            }
          }
          return current;
        });
      } catch (error) {
        console.error(error);
      }
    };

    return () => {
      eventSource.close();
    };
  }, [jobId]);

  const stepsList = useMemo(() => Object.values(steps).sort((a, b) => (a.startedAt ?? 0) - (b.startedAt ?? 0)), [steps]);

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
      <h2 className="text-lg font-semibold">Timeline</h2>
      <div className="mt-3 space-y-4">
        {stepsList.length === 0 && <p className="text-sm text-slate-500">En attente de traitement...</p>}
        {stepsList.map((step) => (
          <article key={step.id} className="rounded border border-slate-100 p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{step.name}</span>
              <span className="capitalize text-slate-500">{step.status}</span>
            </div>
            <div className="mt-2 space-y-1 text-xs text-slate-500">
              {step.startedAt && <p>Début: {new Date(step.startedAt).toLocaleTimeString('fr-FR')}</p>}
              {step.finishedAt && <p>Fin: {new Date(step.finishedAt).toLocaleTimeString('fr-FR')}</p>}
            </div>
            {step.logs.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs text-slate-600">
                {step.logs.map((log, index) => (
                  <li key={index} className="rounded bg-slate-100 px-2 py-1 font-mono">
                    {log}
                  </li>
                ))}
              </ul>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
