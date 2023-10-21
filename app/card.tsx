'use client';
import { Card, Metric, Text, Title, BarList, Flex, Grid } from '@tremor/react';
import { useEffect, useState } from 'react';

export default function CardComponent({
  metadata,
  data,
  type
}: {
  metadata: any;
  data: { name: string; value: any; numberValue: number }[];
  type: 'CHAMPS_WR' | 'CHAMPS_PICKRATE' | 'CHAMPS_KDA';
}) {
  return (
    <Card key={metadata.category}>
      {data.length > 0 ? (
        <>
          <Title>{metadata.category}</Title>
          <Flex
            justifyContent="start"
            alignItems="baseline"
            className="space-x-2"
          >
            <Metric>
              {Array.from(new Set(data.map((item) => item.name))).length}
            </Metric>
            <Text>Unique champions</Text>
          </Flex>
          <Flex className="mt-6">
            <Text>Champion</Text>
            <Text className="text-right">Pick rate (matches)</Text>
          </Flex>
          <BarList
            data={data}
            valueFormatter={
              (number: number) =>
                (number * 100).toFixed(0) +
                '% (' +
                (number * metadata.totalMatches).toFixed(0) +
                '/' +
                metadata.totalMatches +
                ')'
              //Intl.NumberFormat('us').format(number).toString()
            }
            showAnimation={true}
            className="mt-2"
          />
        </>
      ) : (
        <>Loading...</>
      )}
    </Card>
  );
}
