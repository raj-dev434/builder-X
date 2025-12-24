import { Block } from "../schema/types";

export function exportToJSON(blocks: Block[]): string {
  // Remove internal IDs and create a clean schema
  const cleanBlocks = blocks.map((block) => cleanBlockForExport(block));

  const schema = {
    version: "1.0.0",
    generated: new Date().toISOString(),
    blocks: cleanBlocks,
  };

  return JSON.stringify(schema, null, 2);
}

function cleanBlockForExport(block: Block): any {
  const cleanBlock: any = {
    type: block.type,
    props: { ...block.props },
  };

  // Remove any internal or temporary properties
  delete cleanBlock.props.id;

  if (block.children && block.children.length > 0) {
    cleanBlock.children = block.children.map((child) =>
      cleanBlockForExport(child)
    );
  }

  return cleanBlock;
}

export function importFromJSON(jsonString: string): Block[] {
  try {
    const schema = JSON.parse(jsonString);

    if (!schema.blocks || !Array.isArray(schema.blocks)) {
      throw new Error("Invalid schema: blocks array not found");
    }

    // Validate each block structure
    const validBlocks = schema.blocks.filter((block: any) =>
      validateBlock(block)
    );

    // Add IDs back to blocks
    return validBlocks.map((block: any) => addIdsToBlock(block));
  } catch (error) {
    console.error("Failed to import JSON:", error);
    throw new Error("Invalid JSON schema");
  }
}

function validateBlock(block: any): boolean {
  if (!block || typeof block !== "object") return false;
  if (typeof block.type !== "string") return false;
  // Props is optional but should be object if present
  if (block.props && typeof block.props !== "object") return false;

  if (block.children) {
    if (!Array.isArray(block.children)) return false;
    return block.children.every((child: any) => validateBlock(child));
  }

  return true;
}

function addIdsToBlock(block: any): Block {
  const blockWithId = {
    ...block,
    id: generateId(),
  };

  if (block.children && Array.isArray(block.children)) {
    blockWithId.children = block.children.map((child: any) =>
      addIdsToBlock(child)
    );
  }

  return blockWithId;
}

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}
