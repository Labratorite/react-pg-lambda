import React from "react";
import { useFormContext } from "react-hook-form";
import {
  DataGrid,
  GridColDef,
  GridValueGetterParams,
  GridSelectionModel,
  GridRowId,
  GRID_CHECKBOX_SELECTION_COL_DEF,
} from "@mui/x-data-grid";

const columns: GridColDef[] = [
  {
    ...GRID_CHECKBOX_SELECTION_COL_DEF,
    renderHeader: () => "Target",
  },
  { field: "id", headerName: "ID", width: 110 },
  { field: "title", headerName: "Title", width: 130 },
  { field: "author", headerName: "Author", width: 130 },
  {
    field: "content",
    headerName: "Content",
    //type: "number",
    width: 90,
  },
  {
    field: "test",
    headerName: "Combine test",
    description: "This column has a value getter and is not sortable.",
    sortable: false,
    width: 160,
    valueGetter: (params: GridValueGetterParams) =>
      `${params.row.title || ""} ${params.row.author || ""}`,
  },
];

const PostTableCommponent: React.FC<{ posts: Post[] }> = ({ posts }) => {
  console.log("PostTableCommponent");

  const { setValue, watch } = useFormContext<HookForm>();
  const [selection, setSelectionModel] = React.useState<GridSelectionModel>([]);

  const onSelectionModelChange = (newSelection: GridSelectionModel) => {
    setSelectionModel((state): GridSelectionModel => {
      if (newSelection.length === 0) {
        return [];
      } else {
        if (
          state.length < newSelection.length &&
          newSelection.length - state.length > 1
        ) {
          return [newSelection[0]];
        } else {
          return [newSelection[newSelection.length - 1]];
        }
      }
    });
  };

  React.useEffect(() => {
    if (selection.length === 0) {
      setValue("_selectedPost", undefined);
    } else {
      const selected = posts.find((post) => post.id === selection[0]);
      setValue("_selectedPost", selected);
    }
  }, [posts, selection, setValue]);

  React.useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (type === "change") return;

      if (name === "_selectedPost" || !name) {
        const selectedId = selection.length > 0 ? selection[0] : undefined;
        if (selectedId === value?._selectedPost?.id) return;

        // 外部で change event以外で値が更新された場合、Gridに反映する
        if (value?._selectedPost?.id) {
          setSelectionModel([value._selectedPost.id]);
        } else {
          setSelectionModel([]);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [selection, watch]);

  return (
    <>
      <div style={{ height: 277, width: "100%" }}>
        <DataGrid
          rows={posts}
          columns={columns}
          density="compact"
          autoPageSize
          rowsPerPageOptions={[3]}
          checkboxSelection
          selectionModel={selection}
          getRowId={(row) => row.id}
          onSelectionModelChange={onSelectionModelChange}
        />
      </div>
    </>
  );
};

export default PostTableCommponent;
