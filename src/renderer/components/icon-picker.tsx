import React from 'react';
import { Text, BorderBox, FilterList } from '@primer/components';
import { FieldProps } from 'formik';

import { iconSets } from '@renderer/icons';

const IconPicker: React.FC<FieldProps> = ({ field, form }): JSX.Element => {
  const currentIconSet = iconSets.find(
    (iconSet) => iconSet.name === field.value,
  );

  return (
    <React.Fragment>
      <Text
        fontWeight="bold"
        fontSize="14px"
        as="label"
        style={{ display: 'block' }}
        mt="3"
        mb="2"
      >
        Icon set
      </Text>
      <FilterList>
        {iconSets.map(({ name, displayName, icons }) => (
          <FilterList.Item
            key={name}
            mr="3"
            selected={name === field.value}
            onClick={(): void => form.setFieldValue('iconSet', name)}
          >
            <img
              src={icons.contributed}
              style={{
                height: 16,
                marginRight: 10,
                position: 'relative',
                top: 2,
              }}
            />
            {displayName}
          </FilterList.Item>
        ))}
      </FilterList>
      <BorderBox mr="3" mt="3" bg="gray.0">
        <table style={{ width: '100%' }}>
          <tr>
            <td style={{ textAlign: 'center' }}>
              <Text fontWeight="bold" fontSize="14px">
                Pending
              </Text>
            </td>
            <td style={{ textAlign: 'center' }}>
              <Text fontWeight="bold" fontSize="14px">
                Contributed
              </Text>
            </td>
            <td style={{ textAlign: 'center' }}>
              <Text fontWeight="bold" fontSize="14px">
                Streaking
              </Text>
            </td>
          </tr>
          <tr>
            <td style={{ textAlign: 'center' }}>
              <img src={currentIconSet.icons.pending} style={{ height: 16 }} />
            </td>
            <td style={{ textAlign: 'center' }}>
              <img
                src={currentIconSet.icons.contributed}
                style={{ height: 16 }}
              />
            </td>
            <td style={{ textAlign: 'center' }}>
              <img
                src={currentIconSet.icons.streaking}
                style={{ height: 16 }}
              />
            </td>
          </tr>
        </table>
      </BorderBox>
    </React.Fragment>
  );
};

export default IconPicker;