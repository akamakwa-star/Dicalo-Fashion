from fastapi import APIRouter, File, UploadFile

router = APIRouter(prefix="/api/upload", tags=["upload"])


@router.post("")
async def upload_image(file: UploadFile = File(...)) -> dict:
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "message": "Upload endpoint is connected",
    }
