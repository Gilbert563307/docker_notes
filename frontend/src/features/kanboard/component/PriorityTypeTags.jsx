import React from 'react'
import { PRIORITY_FILTER_TYPE_TAGS } from '../../../config';
import SessionMemoryFilter from '../../../shared/presentation/components/custom/SessionMemoryFilter';

export default function PriorityTypeTags() {
    return (
        <>
            {PRIORITY_FILTER_TYPE_TAGS.map((tag) => {
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
