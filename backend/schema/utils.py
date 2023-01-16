from sqlalchemy.orm import joinedload
from strawberry.types.nodes import SelectedField, InlineFragment, FragmentSpread
from sqlalchemy.sql import Select
from database.models import Base

__all__ = ('get_selected_fields', 'add_selected_fields', 'apply_selected_fields')


FIELDS = {
    'Server': {'channels', 'members'},
    'Channel': {'server'},
    'Member': {'server', 'servers'},
    'User': {'servers'},
    'Message': {'server', 'channel', 'author'},
    'Invitation': {'server', 'user'}
}


def get_selected_fields(
        model_name: str,
        info_selected_fields: list[SelectedField, InlineFragment, FragmentSpread],
        is_response_union_type: bool = True
) -> set[str]:
    """Returns a set of fields that were selected."""

    selected_fields = set()

    fields = FIELDS.get(model_name)

    if is_response_union_type:
        for inline_fragment in info_selected_fields[0].selections:
            if isinstance(inline_fragment, InlineFragment) and inline_fragment.type_condition == model_name:
                for selected_field in inline_fragment.selections:
                    if selected_field.name in fields:
                        selected_fields.add(selected_field.name)
                        if fields == selected_fields:
                            return selected_fields
                break
    else:
        for selected_field in info_selected_fields[0].selections:
            if selected_field.name in fields:
                selected_fields.add(selected_field.name)
                if fields == selected_fields:
                    return selected_fields

    return selected_fields


def apply_selected_fields(
        sql: Select,
        model: Base,
        selected_fields: set[str]
) -> Select:
    """Adds the options to join-load the selected fields for better performance."""

    for field in selected_fields:
        sql = sql.options(joinedload(getattr(model, field)))

    return sql


def add_selected_fields(
        sql: Select,
        model: Base,
        info_selected_fields: list[SelectedField, InlineFragment, FragmentSpread],
        is_response_union_type: bool = True
) -> Select:
    """Gets the selected fields and adds the options to join-load the selected fields for better performance."""

    selected_fields = get_selected_fields(
        model.__class__.__name__,
        info_selected_fields,
        is_response_union_type
    )

    return apply_selected_fields(sql, model, selected_fields)
