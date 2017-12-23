from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.utils.urls import remove_query_param, replace_query_param


class AllPagesNumbersPagination(PageNumberPagination):

    def get_paginated_response(self, data):
        print(data)
        return Response({
            'links': self.get_all_links(),
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'results': data
        })

    def get_all_links(self):
        paginator = self.page.paginator
        links = []
        base_url = self.request.build_absolute_uri()
        for page_number in paginator.page_range:
            s_link = ""
            if page_number == 1:
                s_link = remove_query_param(
                    base_url,
                    self.page_query_param
                )
            else:
                s_link = replace_query_param(
                    base_url,
                    self.page_query_param,
                    page_number
                )
            links.append({
                'page': page_number,
                'url': s_link
            })
        return links
