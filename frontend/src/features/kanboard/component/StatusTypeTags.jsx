import React from 'react'
import { STATUS_FILTER_TYPE_TAGS } from '../../../config';
import SessionMemoryFilter from '../../../shared/components/custom/SessionMemoryFilter';

export default function StatusTypeTags() {
    return (
        <>
            {STATUS_FILTER_TYPE_TAGS.map((tag) => {
                return (
                    <li className="dialogic-domain-tag-li" key={tag.id}>
                        <SessionMemoryFilter
                            FILTER_TO_CHECK={tag.config}
                            LABEL=""
                            ID={tag.config}
                        />
                        <span className="dialogic-domain-tag-button dropdown-item">
                            {tag.name}
                        </span>
                    </li>
                );
            })}
        </>
    )
}
