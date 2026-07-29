import { uniqueId } from "lodash";
import { usePostApiStudentSessionStart } from "@/server/api";
import { usePracticeStore } from "@/store/practice";

type StartSessionArgs = { unitId: number };

export const useStartSession = () => {
  const start = usePracticeStore(s => s.start);
  const { mutateAsync, isPending, ...rest } = usePostApiStudentSessionStart();

  const startSession = async ({ unitId }: StartSessionArgs) => {
    const res = await mutateAsync({ unitId });
    const transformed = res.exercises.map(ex => ({
      ...ex,
      options: ex.options?.map(opt => ({ uuid: uniqueId(), text: opt })).sort(() => Math.random() - 0.5),
    }));
    start(transformed, res.sessionId!);
    return res;
  };

  return { startSession, isPending, ...rest };
};
