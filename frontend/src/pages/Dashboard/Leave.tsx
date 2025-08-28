
import PageMeta from "../../components/common/PageMeta";
import LeavePage from "../../features/leaves/LeavePage";

export default function Position() {
  return (
    <>
      <PageMeta
        title="Human Resource Managerment"
        description="Human Resource Managerment - ItAiUa"
      />

      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1">
          <LeavePage />
        </div>
      </div>
    </>
  );
}