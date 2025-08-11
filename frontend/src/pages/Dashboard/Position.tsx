
import PageMeta from "../../components/common/PageMeta";
import PositionPage from "../../features/positions/PositionPage";

export default function Position() {
  return (
    <>
      <PageMeta
        title="Human Resource Managerment"
        description="Human Resource Managerment - ItAiUa"
      />

      <div className="grid grid-cols-1 w-full">
        <div className="col-span-1">
          <PositionPage />
        </div>
      </div>
    </>
  );
}
