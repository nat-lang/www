from typing import List

from fastapi.encoders import jsonable_encoder
from sqlalchemy.orm import Session, joinedload

from app.crud.base import CRUDBase
from app.models import Text
from app.schemas.text import TextCreate, TextUpdate
from app.factories import SentencesFactory



class CRUDText(CRUDBase[Text, TextCreate, TextUpdate]):
    def create(self, db: Session, *, obj_in: TextCreate) -> Text:
        obj_in_data = jsonable_encoder(obj_in)
        text = self.model(**obj_in_data)  # type: ignore
        db.add(text)
        db.add(SentencesFactory(text))
        db.commit()
        db.refresh(text)
        return text

    def get_multi(
        self, db: Session, *, skip: int = 0, limit: int = 100
    ) -> List[Text]:
        foo = db.query(self.model).options(
            joinedload(self.model.sentences)
        ).offset(skip).limit(limit).all()
        print(foo)
        return foo

    def get_multi_by_author(
        self, db: Session, *, author_id: int, skip: int = 0, limit: int = 100
    ) -> List[Text]:
        return (
            db.query(self.model)
            .filter(Text.author_id == author_id)
            .offset(skip)
            .limit(limit)
            .all()
        )


text = CRUDText(Text)